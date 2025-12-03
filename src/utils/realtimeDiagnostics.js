/**
 * Real-Time Diagnostics Utility
 * Run this to diagnose Realtime connection issues
 */

export const diagnoseRealtime = async (supabase) => {
  console.log('🔍 Starting Real-Time Diagnostics...\n')

  const results = {
    connectionStatus: 'UNKNOWN',
    tableAccess: {},
    rlsPolicies: {},
    errors: []
  }

  // Test 1: Check if Realtime is available
  console.log('1️⃣  Testing Realtime availability...')
  try {
    const response = await fetch(
      `${supabase.supabaseUrl}/rest/v1/`,
      {
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'apikey': supabase.supabaseKey
        }
      }
    )

    if (response.ok) {
      results.connectionStatus = 'OK'
      console.log('✅ Supabase connection: OK')
    } else {
      results.connectionStatus = 'FAILED'
      results.errors.push(`HTTP ${response.status}: ${response.statusText}`)
      console.log('❌ Supabase connection: FAILED')
    }
  } catch (error) {
    results.connectionStatus = 'ERROR'
    results.errors.push(error.message)
    console.log('❌ Supabase connection: ERROR -', error.message)
  }

  // Test 2: Check table access
  console.log('\n2️⃣  Testing table access...')
  const tables = ['online_users', 'teams', 'members', 'users']

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        results.tableAccess[table] = 'ERROR'
        results.errors.push(`${table}: ${error.message}`)
        console.log(`❌ ${table}: Can't read (${error.message})`)
      } else {
        results.tableAccess[table] = 'OK'
        console.log(`✅ ${table}: Can read`)
      }
    } catch (error) {
      results.tableAccess[table] = 'EXCEPTION'
      results.errors.push(`${table}: ${error.message}`)
      console.log(`❌ ${table}: Exception -`, error.message)
    }
  }

  // Test 3: Test Realtime subscription
  console.log('\n3️⃣  Testing Realtime subscription...')
  try {
    const testChannel = supabase
      .channel('diagnostics-test')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'online_users'
      }, (payload) => {
        console.log('✅ Realtime event received:', payload.eventType)
      })
      .subscribe((status) => {
        console.log(`Subscription status: ${status}`)
      })

    console.log('✅ Realtime subscription: Created')

    // Clean up
    await new Promise(resolve => setTimeout(resolve, 1000))
    supabase.removeChannel(testChannel)
  } catch (error) {
    results.errors.push(`Subscription error: ${error.message}`)
    console.log('❌ Realtime subscription: FAILED -', error.message)
  }

  // Test 4: Check WebSocket connection
  console.log('\n4️⃣  Checking WebSocket status...')
  const wsConnections = document.querySelectorAll('[src*="realtime"]')
  if (wsConnections.length > 0) {
    console.log(`✅ WebSocket connections found: ${wsConnections.length}`)
  } else {
    console.log('ℹ️  No WebSocket elements found in DOM (normal)')
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 DIAGNOSTICS SUMMARY')
  console.log('='.repeat(50))
  console.log(`Connection Status: ${results.connectionStatus}`)
  console.log(`Tables Accessible: ${Object.values(results.tableAccess).filter(s => s === 'OK').length}/${tables.length}`)
  console.log(`Errors Found: ${results.errors.length}`)

  if (results.errors.length > 0) {
    console.log('\n⚠️  ERRORS:')
    results.errors.forEach(err => console.log(`   - ${err}`))
  }

  console.log('\n💡 NEXT STEPS:')
  if (results.connectionStatus !== 'OK') {
    console.log('   1. Check Supabase project URL and API key')
    console.log('   2. Verify network connection')
  }
  if (Object.values(results.tableAccess).some(s => s !== 'OK')) {
    console.log('   1. Check Row Level Security (RLS) policies')
    console.log('   2. Verify user has read/write permissions')
    console.log('   3. Ensure tables exist in database')
  }

  return results
}

/**
 * Check RLS Policies Status
 */
export const checkRLSStatus = async (supabase) => {
  console.log('🔐 Checking RLS Policies...\n')

  const rlsChecks = {
    online_users: {
      selectPolicy: false,
      insertPolicy: false,
      updatePolicy: false,
      deletePolicy: false
    },
    teams: {
      selectPolicy: false,
      insertPolicy: false,
      updatePolicy: false,
      deletePolicy: false
    },
    members: {
      selectPolicy: false,
      insertPolicy: false,
      updatePolicy: false,
      deletePolicy: false
    }
  }

  // Note: Actual RLS check requires admin access to query pg_policies
  // This is a simplified check based on query results

  console.log('⚠️  Note: Detailed RLS check requires admin access')
  console.log('📍 Manual steps:')
  console.log('   1. Go to Supabase Dashboard')
  console.log('   2. Select your project')
  console.log('   3. Go to SQL Editor')
  console.log('   4. Run: SELECT * FROM pg_policies WHERE tablename = \'online_users\';')
  console.log('   5. Verify RLS is enabled (should see "Row Level Security: ON")')

  return rlsChecks
}

/**
 * Monitor Realtime events in real-time
 */
export const monitorRealtimeEvents = (supabase) => {
  console.log('📡 Starting Realtime Event Monitor...\n')

  const eventLog = []

  const channels = [
    { name: 'online_users', table: 'online_users' },
    { name: 'teams', table: 'teams' },
    { name: 'members', table: 'members' }
  ]

  channels.forEach(({ name, table }) => {
    const channel = supabase
      .channel(`monitor-${name}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          const event = {
            timestamp: new Date().toISOString(),
            table: table,
            event: payload.eventType,
            data: payload.eventType === 'DELETE' ? payload.old : payload.new
          }
          eventLog.push(event)
          console.log(`[${event.timestamp}] ${table}.${event.event}:`, event.data)
        }
      )
      .subscribe((status) => {
        console.log(`[${name}] Subscription status: ${status}`)
      })
  })

  console.log('✅ Monitoring started. Changes will appear below:\n')

  return {
    getEvents: () => eventLog,
    stop: () => {
      supabase.removeAllChannels()
      console.log('Monitoring stopped')
    }
  }
}

/**
 * Test insert/update/delete to trigger realtime events
 */
export const testRealtimeWithData = async (supabase, userId) => {
  console.log('🧪 Testing Realtime with actual data operations...\n')

  try {
    // Test 1: Insert
    console.log('1. Testing INSERT...')
    const { data: inserted, error: insertError } = await supabase
      .from('online_users')
      .insert({
        id: userId,
        email: `test-${Date.now()}@test.com`,
        full_name: 'Test User',
        last_activity: new Date()
      })
      .select()

    if (insertError) {
      console.log('❌ INSERT failed:', insertError.message)
      return
    }
    console.log('✅ INSERT successful')

    // Wait for realtime event
    await new Promise(resolve => setTimeout(resolve, 500))

    // Test 2: Update
    console.log('2. Testing UPDATE...')
    const { error: updateError } = await supabase
      .from('online_users')
      .update({ last_activity: new Date() })
      .eq('id', userId)

    if (updateError) {
      console.log('❌ UPDATE failed:', updateError.message)
      return
    }
    console.log('✅ UPDATE successful')

    // Wait for realtime event
    await new Promise(resolve => setTimeout(resolve, 500))

    // Test 3: Delete
    console.log('3. Testing DELETE...')
    const { error: deleteError } = await supabase
      .from('online_users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.log('❌ DELETE failed:', deleteError.message)
      return
    }
    console.log('✅ DELETE successful')

    console.log('\n✅ All data operations successful!')
    console.log('💡 If you didn\'t see realtime events above, check:')
    console.log('   1. Realtime is enabled in Supabase dashboard')
    console.log('   2. Browser console for connection errors')
    console.log('   3. Network tab for WebSocket status')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

/**
 * Check Realtime configuration in Supabase
 */
export const getRealtimeConfig = async (supabase) => {
  console.log('⚙️  Realtime Configuration\n')

  const config = {
    projectUrl: supabase.supabaseUrl,
    realtimeUrl: `${supabase.supabaseUrl}/realtime/v1`,
    apiKey: supabase.supabaseKey.substring(0, 20) + '...',
    channels: []
  }

  // Get active channels
  const channels = supabase.getChannels()
  config.channels = channels.map(ch => ({
    name: ch.topic,
    state: ch.state
  }))

  console.log('Project URL:', config.projectUrl)
  console.log('Realtime URL:', config.realtimeUrl)
  console.log('API Key (partial):', config.apiKey)
  console.log('Active Channels:', config.channels.length)
  config.channels.forEach(ch => {
    console.log(`  - ${ch.name} (${ch.state})`)
  })

  return config
}

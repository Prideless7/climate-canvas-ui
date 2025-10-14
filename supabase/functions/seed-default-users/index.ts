import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if users already exist
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const adminExists = existingUsers?.users.some(u => u.email === 'admin@app.local')
    const userExists = existingUsers?.users.some(u => u.email === 'user@app.local')

    const results = {
      admin: adminExists ? 'already_exists' : 'created',
      user: userExists ? 'already_exists' : 'created'
    }

    // Create admin user if not exists
    if (!adminExists) {
      const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email: 'admin@app.local',
        password: 'admin',
        email_confirm: true,
        user_metadata: {
          username: 'admin'
        }
      })

      if (adminError) throw new Error(`Failed to create admin: ${adminError.message}`)

      // Assign admin role
      if (adminUser.user) {
        await supabaseAdmin.from('user_roles').insert({
          user_id: adminUser.user.id,
          role: 'admin'
        })
      }
    }

    // Create regular user if not exists
    if (!userExists) {
      const { data: regularUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: 'user@app.local',
        password: 'user',
        email_confirm: true,
        user_metadata: {
          username: 'user'
        }
      })

      if (userError) throw new Error(`Failed to create user: ${userError.message}`)

      // Assign user role
      if (regularUser.user) {
        await supabaseAdmin.from('user_roles').insert({
          user_id: regularUser.user.id,
          role: 'user'
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Default users initialized',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
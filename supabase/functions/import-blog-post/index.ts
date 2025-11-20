import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogPostFrontmatter {
  title: string;
  slug: string;
  excerpt?: string;
  meta_description?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  author_name?: string;
  author_bio?: string;
  published?: boolean;
  read_time_minutes?: number;
}

function parseFrontmatter(markdown: string): { frontmatter: BlogPostFrontmatter; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('No frontmatter found in markdown file');
  }
  
  const frontmatterText = match[1];
  const content = match[2].trim();
  
  const frontmatter: any = {};
  const lines = frontmatterText.split('\n');
  
  let currentKey = '';
  let arrayMode = false;
  
  for (const line of lines) {
    if (line.trim().startsWith('-') && arrayMode) {
      // Array item
      const value = line.trim().substring(1).trim().replace(/^["']|["']$/g, '');
      if (!frontmatter[currentKey]) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(value);
    } else if (line.includes(':')) {
      // Key-value pair
      const colonIndex = line.indexOf(':');
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      value = value.replace(/^["']|["']$/g, '');
      
      // Check if this is the start of an array
      if (value === '' || value === '[') {
        arrayMode = true;
        currentKey = key;
        frontmatter[key] = [];
      } else {
        arrayMode = false;
        currentKey = key;
        
        // Parse booleans
        if (value === 'true') {
          frontmatter[key] = true;
        } else if (value === 'false') {
          frontmatter[key] = false;
        } else if (!isNaN(Number(value)) && value !== '') {
          frontmatter[key] = Number(value);
        } else {
          frontmatter[key] = value;
        }
      }
    }
  }
  
  return { frontmatter, content };
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roles || roles.role !== 'admin') {
      throw new Error('Admin access required');
    }

    const { markdown } = await req.json();

    if (!markdown) {
      throw new Error('No markdown content provided');
    }

    console.log('📝 Parsing markdown file...');
    const { frontmatter, content } = parseFrontmatter(markdown);

    // Calculate read time if not provided
    const readTime = frontmatter.read_time_minutes || calculateReadTime(content);

    console.log('📊 Frontmatter:', frontmatter);

    // Check if post with this slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', frontmatter.slug)
      .single();

    let result;
    if (existingPost) {
      console.log('🔄 Updating existing post:', frontmatter.slug);
      // Update existing post
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: frontmatter.title,
          excerpt: frontmatter.excerpt || null,
          content: content,
          cover_image_url: frontmatter.cover_image_url || null,
          category: frontmatter.category || 'General',
          tags: frontmatter.tags || [],
          meta_description: frontmatter.meta_description || null,
          author_name: frontmatter.author_name || 'Westfield Team',
          author_bio: frontmatter.author_bio || 'Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment, Amazon FBA prep, and Shopify logistics.',
          published: frontmatter.published ?? false,
          read_time_minutes: readTime,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPost.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      console.log('✨ Creating new post:', frontmatter.slug);
      // Insert new post
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: frontmatter.title,
          slug: frontmatter.slug,
          excerpt: frontmatter.excerpt || null,
          content: content,
          cover_image_url: frontmatter.cover_image_url || null,
          category: frontmatter.category || 'General',
          tags: frontmatter.tags || [],
          meta_description: frontmatter.meta_description || null,
          author_name: frontmatter.author_name || 'Westfield Team',
          author_bio: frontmatter.author_bio || 'Expert team at Westfield Prep Center with years of experience in e-commerce fulfillment, Amazon FBA prep, and Shopify logistics.',
          published: frontmatter.published ?? false,
          read_time_minutes: readTime,
          published_at: frontmatter.published ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    console.log('✅ Blog post imported successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: result,
        action: existingPost ? 'updated' : 'created'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Import error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

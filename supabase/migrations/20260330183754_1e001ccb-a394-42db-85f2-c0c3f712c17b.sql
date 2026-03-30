
-- AI providers configured by the user
CREATE TABLE public.ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  api_key TEXT,
  api_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own providers" ON public.ai_providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own providers" ON public.ai_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own providers" ON public.ai_providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own providers" ON public.ai_providers FOR DELETE USING (auth.uid() = user_id);

-- AI task configurations (which model for which task)
CREATE TABLE public.ai_task_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  task TEXT NOT NULL,
  provider_id UUID REFERENCES public.ai_providers(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  temperature REAL DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  top_p REAL DEFAULT 0.9,
  frequency_penalty REAL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, task)
);

ALTER TABLE public.ai_task_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task configs" ON public.ai_task_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own task configs" ON public.ai_task_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own task configs" ON public.ai_task_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own task configs" ON public.ai_task_configs FOR DELETE USING (auth.uid() = user_id);

-- Add global AI parameters to user_settings
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS ai_global_params JSONB DEFAULT '{"temperature": 0.7, "max_tokens": 2000, "top_p": 0.9, "frequency_penalty": 0.0}'::jsonb;

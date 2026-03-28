
-- Create storage bucket for offer images
INSERT INTO storage.buckets (id, name, public) VALUES ('offer-images', 'offer-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload offer images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'offer-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to offer images
CREATE POLICY "Offer images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'offer-images');

-- Allow users to update their own images
CREATE POLICY "Users can update own offer images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'offer-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own offer images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'offer-images' AND auth.uid()::text = (storage.foldername(name))[1]);

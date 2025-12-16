-- Create a public storage bucket for 3D models and assets
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('assets', 'assets', true, 52428800);

-- Allow anyone to view files in the assets bucket
CREATE POLICY "Public access to assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Allow anyone to upload files to the assets bucket (for now, can restrict later)
CREATE POLICY "Anyone can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets');
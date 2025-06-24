import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Option 1: Use ImgBB (free tier: 32MB storage, no account required for basic use)
    // You can get a free API key from https://api.imgbb.com/
    const imgbbResponse = await uploadToImgBB(base64Image);
    if (imgbbResponse.success) {
      return NextResponse.json({ 
        imageUrl: imgbbResponse.data.url,
        deleteUrl: imgbbResponse.data.delete_url 
      });
    }

    // Option 2: Fallback to file.io (temporary storage, 14 days)
    const fileIoResponse = await uploadToFileIo(buffer, file.name);
    if (fileIoResponse.success) {
      return NextResponse.json({ 
        imageUrl: fileIoResponse.link,
        temporary: true,
        note: 'Image will be available for 14 days'
      });
    }

    // Option 3: Final fallback - return as data URL (inline base64)
    const dataUrl = `data:${file.type};base64,${base64Image}`;
    return NextResponse.json({ 
      imageUrl: dataUrl,
      inline: true,
      note: 'Image stored inline (may increase page size)'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// ImgBB upload (best option - permanent free hosting)
async function uploadToImgBB(base64Image: string) {
  try {
    // You can get a free API key from https://api.imgbb.com/
    // For demo purposes, using a public key (replace with your own)
    const apiKey = process.env.IMGBB_API_KEY || 'demo_key';
    
    if (apiKey === 'demo_key') {
      return { success: false, error: 'No ImgBB API key configured' };
    }

    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('key', apiKey);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        data: {
          url: data.data.url,
          delete_url: data.data.delete_url,
        }
      };
    }

    return { success: false, error: data.error?.message || 'ImgBB upload failed' };
  } catch (error) {
    return { success: false, error: 'ImgBB upload error' };
  }
}

// File.io upload (temporary but reliable)
async function uploadToFileIo(buffer: Buffer, filename: string) {
  try {
    const formData = new FormData();
    const blob = new Blob([buffer]);
    formData.append('file', blob, filename);

    const response = await fetch('https://file.io/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        link: data.link
      };
    }

    return { success: false, error: 'File.io upload failed' };
  } catch (error) {
    return { success: false, error: 'File.io upload error' };
  }
}

// For development, you can also add cloudinary, uploadcare, or other services
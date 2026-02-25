# Cloudinary Setup Instructions

## 1. Create Free Cloudinary Account
- Go to: https://cloudinary.com/users/register/free
- Sign up with email
- Verify your email

## 2. Get Your Credentials
- Login to Cloudinary Dashboard
- Go to Dashboard (https://cloudinary.com/console)
- Copy these values:
  - Cloud Name
  - API Key
  - API Secret

## 3. Update .env File
Open `backend/.env` and replace:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 4. Restart Backend Server
```bash
cd backend
npm run dev
```

## 5. Test Upload
- Login to admin panel
- Go to Gallery section
- Upload an image
- Image will be stored on Cloudinary

## API Usage

### Upload File
```javascript
POST /api/upload
Headers: Authorization: Bearer <token>
Body: FormData with 'file' field
Response: { url: "cloudinary_url" }
```

### Gallery Upload
```javascript
POST /api/gallery
Headers: Authorization: Bearer <token>
Body: FormData with 'image' field + other gallery data
```

## Free Tier Limits
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25 credits/month

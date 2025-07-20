# Public Assets Structure

This directory contains all static assets for the Astro portfolio project.

## 📁 Folder Structure

```
public/
├── favicon.svg                 # Main favicon (SVG format)
├── favicons/                   # All favicon sizes and PWA icons
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   └── site.webmanifest
└── images/
    ├── profile/                # Profile photos and personal images
    │   └── profile-photo.webp
    ├── backgrounds/            # Hero and section backgrounds
    │   ├── cyber-background.webp
    │   ├── hexagon-pattern.webp
    │   └── cybersecurity-shield-background.webp
    ├── certificates/           # Certification badges
    │   ├── google-cybersecurity-cert.webp
    │   ├── qualys-cert.webp
    │   └── un-cyberdiplomacy-cert.webp
    ├── icons/                  # Icon sets and small graphics
    │   └── cybersecurity-icons.webp
    └── logos/                  # Company and university logos
        └── university-logo.webp
```

## 🎯 Usage in Astro Components

```astro
<!-- Profile image -->
<img src="/images/profile/profile-photo.webp" alt="Profile" />

<!-- Background image -->
<div style="background-image: url('/images/backgrounds/cyber-background.webp')">

<!-- Certificate -->
<img src="/images/certificates/google-cybersecurity-cert.webp" alt="Google Cybersecurity Certificate" />
```

## 📝 Notes

- All images are optimized in WebP format for better performance
- Favicon files support multiple sizes for different devices
- Use absolute paths starting with `/` when referencing these assets
- Images are automatically served by Astro's static file serving
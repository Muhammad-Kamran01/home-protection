#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

public_path = os.path.join(os.path.dirname(__file__), 'public')

# Create favicon PNGs with a simple design
sizes = [16, 32, 64, 128]

for size in sizes:
    # Create image with white background
    img = Image.new('RGBA', (size, size), color=(255, 255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw blue circle background
    margin = max(1, size // 8)
    draw.ellipse([margin, margin, size - margin, size - margin], fill=(30, 136, 229, 255))
    
    # Add "HP" text if size is large enough
    if size >= 32:
        # Try to use a default font, fall back to default if not available
        try:
            font = ImageFont.truetype("arial.ttf", size // 2)
        except:
            font = ImageFont.load_default()
        
        # Draw text
        text = "HP"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - 2
        draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))
    
    # Save as PNG
    output_file = os.path.join(public_path, f'favicon-{size}.png')
    img.save(output_file, 'PNG')
    print(f"✓ Generated {os.path.basename(output_file)} ({size}x{size})")

print("\nFavicon generation complete!")

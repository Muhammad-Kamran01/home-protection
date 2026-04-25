#!/usr/bin/env python3
import cairosvg
import os

base_path = os.path.dirname(os.path.abspath(__file__))
public_path = os.path.join(base_path, 'public')

svg_file = os.path.join(public_path, 'favicon.svg')

# Generate PNG versions
sizes = [16, 32, 64]
for size in sizes:
    output_file = os.path.join(public_path, f'favicon-{size}.png')
    try:
        cairosvg.svg2png(url=svg_file, write_to=output_file, output_width=size, output_height=size)
        print(f"✓ Generated {output_file}")
    except Exception as e:
        print(f"✗ Failed to generate {output_file}: {e}")

print("\nFavicon generation complete!")

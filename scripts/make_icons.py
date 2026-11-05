import zlib
import struct
import math
import os

def create_png(width, height, draw_pixel):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_pixel(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    compressed = zlib.compress(bytes(raw_data), 9)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', 13))
    png.extend(b'IHDR')
    png.extend(ihdr_data)
    png.extend(struct.pack('>I', ihdr_crc))
    
    # IDAT chunk
    png.extend(struct.pack('>I', len(compressed)))
    png.extend(b'IDAT')
    png.extend(compressed)
    png.extend(struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
    
    # IEND chunk
    png.extend(struct.pack('>I', 0))
    png.extend(b'IEND')
    png.extend(struct.pack('>I', zlib.crc32(b'IEND')))
    
    return bytes(png)

def icon_pixel(x, y, w, h):
    # Normalized coords
    nx = x / float(w)
    ny = y / float(h)
    cx = (x + 0.5) - w / 2.0
    cy = (y + 0.5) - h / 2.0
    dist_center = math.sqrt(cx * cx + cy * cy)
    radius = w * 0.46
    
    # Corner rounding
    margin = w * 0.08
    corner_r = w * 0.22
    inside_box = False
    
    # Rounded rectangle test
    bx = min(max(x + 0.5, margin + corner_r), w - margin - corner_r)
    by = min(max(y + 0.5, margin + corner_r), h - margin - corner_r)
    dx = (x + 0.5) - bx
    dy = (y + 0.5) - by
    dist_corner = math.sqrt(dx * dx + dy * dy)
    
    if dist_corner <= corner_r:
        # Inside rounded rect
        # Gradient from Indigo (79, 70, 229) to Amber (245, 158, 11)
        t = (nx + ny) * 0.5
        r = int(79 * (1 - t) + 245 * t)
        g = int(70 * (1 - t) + 158 * t)
        b = int(229 * (1 - t) + 11 * t)
        
        # Draw speaker icon / soundwaves
        # Speaker body:
        # box at left of center
        sx = cx / (w / 32.0)
        sy = cy / (h / 32.0)
        
        # Speaker cone
        is_speaker = False
        if -8 <= sx <= -3 and -4 <= sy <= 4:
            is_speaker = True
        elif -3 <= sx <= 2 and abs(sy) <= (sx + 3) * 1.5 + 4:
            is_speaker = True
            
        # Soundwaves arc
        is_wave = False
        wave_dist = math.sqrt((sx - 0)**2 + sy**2)
        if 4.5 <= wave_dist <= 6.5 and sx > 1 and abs(sy) < sx * 1.2:
            is_wave = True
        if 8.5 <= wave_dist <= 10.5 and sx > 2 and abs(sy) < sx * 1.4:
            is_wave = True
            
        if is_speaker:
            return (255, 255, 255, 255)
        elif is_wave:
            return (255, 255, 255, 230)
            
        return (r, g, b, 255)
    else:
        # Transparent outside rounded rect
        return (0, 0, 0, 0)

os.makedirs('public/icons', exist_ok=True)
for size in [16, 48, 128]:
    png_data = create_png(size, size, icon_pixel)
    with open(f'public/icons/icon{size}.png', 'wb') as f:
        f.write(png_data)
    print(f"Generated public/icons/icon{size}.png ({len(png_data)} bytes)")

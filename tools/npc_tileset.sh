# Excuse my weak bash skills.

# How it works:
# 1. Copy a bunch of 32x32 pixel transparent NPCs
# 2. Paste them /tools/dump folder (create it)
# 3. Run command from /tools
# 4. Move newly-generated file to correct folder
# (somewhere along the lines of /src/assets/graphics/actors...)
# or learn GIMP.

echo "Which item content do you want to update?"
echo "[1. npcs]"
read CONTENT
WHICH=(none npcs)
echo "Updating ${WHICH[CONTENT]} section with ImageMagick and Bash!"

# Take a certain RGB and make it tranparent
# (A lot of Navarra's current tileset comes in hot pink...)
mogrify -channel rgba -matte -fuzz 40% -fill "rgba(255,0,255,0.0)" -opaque "rgb(255,0,255)" dump/${WHICH[CONTENT]}/*.png

# Use this command line to crop actors (if need be)
# mogrify -crop 32x32+0+0 -gravity Center ${WHICH[CONTENT]}/*.png

# Concatenate all images together in /dump zone
montage -mode concatenate -background none -tile x1 dump/${WHICH[CONTENT]}/*.png dump/opt${WHICH[CONTENT]}.png

# Append newly-made image and add to existing one
convert dump/${WHICH[CONTENT]}.png dump/opt${WHICH[CONTENT]}.png +append dump/${WHICH[CONTENT]}.png

# Delete used photos...
rm -rf dump/opt${WHICH[CONTENT]}.png
rm -rf dump/*

# Hip. Hip. Hooray!
echo "${WHICH[CONTENT]} has finished updated. Move the newly-generated file to its correct place."
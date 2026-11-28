# Add photos to the memories album

1. In GitHub, open the repository's `photos` folder and choose **Add file → Upload files**.
2. Upload your photos, then commit the changes.
3. Edit `memories.json` and add one entry per photo to its `photos` array:

   ```json
   {
     "photos": [
       {
         "src": "photos/our-day.jpg",
         "caption": "Our day together"
       }
     ]
   }
   ```

4. Commit `memories.json`. After GitHub Pages finishes deploying, the new photos appear in the album.

Use the exact filename and capitalization. Photos in a public repository are publicly accessible, so only add pictures you're comfortable sharing.

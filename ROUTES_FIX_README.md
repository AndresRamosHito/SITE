# Orchidarc route fix

This bundle contains regenerated static pages from `build.py` with these fixes:

1. `gallery.html` is added to the top navigation after Species.
2. `gallery.html` is added to the footer under Work.
3. `gallery.html` is marked active on the Gallery page.
4. `herbarium.html` is regenerated with the species grid instead of the wrong essay content.
5. All generated pages are aligned with their filenames.

## Apply

Copy these files into the root of the GitHub repository, replacing existing files with the same names.
Then commit and push:

```bash
git add .
git commit -m "Fix static page routes and restore herbarium/gallery"
git push
```

GitHub Pages should redeploy automatically.

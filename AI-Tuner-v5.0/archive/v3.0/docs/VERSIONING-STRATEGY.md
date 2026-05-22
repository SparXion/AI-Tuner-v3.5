# AI Tuner Versioning Strategy

**Date**: November 2025  
**Purpose**: Preserve v2.0 while developing v6.0

---

## Version Preservation Strategy

### ✅ Current Status

**v2.0 (Stable) - PRESERVED**
- **Git Tag**: `v2.0-stable` 
- **Branch**: `main` (original codebase)
- **Status**: Published to VS Code Marketplace
- **Web App**: Live on GitHub Pages
- **Location**: Never modified - remains intact

**v6.0 (Development) - NEW BRANCH**
- **Branch**: `v6.0-upgrade`
- **Status**: Development branch for upgrades
- **Location**: Separate branch - modifications here don't affect v2.0

---

## How It Works

### Git Structure

```
main (v2.0-stable)
  ├── Tag: v2.0-stable ✅ PRESERVED
  ├── Extension: v2.0.0 (published)
  └── Web App: Live on GitHub Pages
  
v6.0-upgrade (NEW)
  ├── All v6.0 development happens here
  ├── Can be merged back to main when ready
  └── Does NOT affect v2.0
```

### Branch Protection

**v2.0 (main branch):**
- ✅ Tagged as `v2.0-stable` for easy checkout
- ✅ Can always return to: `git checkout v2.0-stable`
- ✅ Can create new branch from v2.0: `git checkout -b backup-name v2.0-stable`
- ✅ Published extension remains unchanged

**v6.0 (v6.0-upgrade branch):**
- ✅ All modifications happen here
- ✅ Can experiment freely without breaking v2.0
- ✅ Can merge to main when ready for production
- ✅ Can be abandoned if needed (v2.0 still intact)

---

## Workflow

### Starting Development

```bash
# Switch to v6.0 development branch
git checkout v6.0-upgrade

# Make changes, test, commit
git add .
git commit -m "Phase 1: Add model selector"
```

### Returning to v2.0 (if needed)

```bash
# Switch back to stable v2.0
git checkout main
# OR
git checkout v2.0-stable
```

### Viewing v2.0 Files

```bash
# Compare v2.0 with v6.0
git diff main v6.0-upgrade

# See what changed
git log main..v6.0-upgrade
```

### Creating Backup Branches

```bash
# Create backup before major changes
git checkout -b backup-before-phase2 v6.0-upgrade
```

---

## File Structure Comparison

### v2.0 (main branch) - PRESERVED
```
/
├── index.html (v2.0 version)
├── script.js (v2.0 version)
├── style.css (v2.0 version)
├── presets.js (v2.0 version)
└── cursor-ai-tuner/ (v2.0 extension)
```

### v6.0 (v6.0-upgrade branch) - MODIFIED
```
/
├── index.html (v6.0 version - modified)
├── script.js (v6.0 version - modified)
├── style.css (v6.0 version - modified)
├── presets.js (v6.0 version - modified)
├── js/ (NEW - modular structure)
└── cursor-ai-tuner/ (v6.0 extension - modified)
```

**Key Point**: Files can have the same names but different content. Git tracks the differences.

---

## Deployment Strategy

### v2.0 Remains Published

- **Extension**: Stays at v2.0.0 on VS Code Marketplace
- **Web App**: Continues running from `main` branch on GitHub Pages
- **Users**: Continue using v2.0 until v6.0 is ready

### v6.0 Testing

- **Local Testing**: Test v6.0 locally in development
- **Beta Testing**: Can deploy v6.0 to separate GitHub Pages branch
- **Extension Testing**: Test v6.0 extension locally before publishing

### v6.0 Release

When v6.0 is ready:
1. Test thoroughly on `v6.0-upgrade` branch
2. Merge to `main` when approved
3. Update extension version to 6.0.0
4. Publish to marketplace
5. Update GitHub Pages deployment

---

## Rollback Plan

### If v6.0 Has Issues

**Option 1: Stay on v2.0**
```bash
# Simply don't merge v6.0 to main
# v2.0 remains published and working
```

**Option 2: Revert Changes**
```bash
# If merged but need to revert
git checkout main
git revert <commit-hash>
```

**Option 3: Create New Branch from v2.0**
```bash
# Start fresh from stable v2.0
git checkout -b v6.0-retry v2.0-stable
```

---

## Safety Checklist

Before starting v6.0 development:

- [x] ✅ v2.0 tagged as `v2.0-stable`
- [x] ✅ v6.0 branch created (`v6.0-upgrade`)
- [x] ✅ Currently on v6.0 branch
- [ ] ⏳ Test that v2.0 can be checked out
- [ ] ⏳ Document any breaking changes
- [ ] ⏳ Set up feature flags if needed

---

## Quick Reference

```bash
# View current branch
git branch

# Switch to v6.0 development
git checkout v6.0-upgrade

# Switch back to v2.0 stable
git checkout main
# OR
git checkout v2.0-stable

# Compare versions
git diff main v6.0-upgrade

# See all branches
git branch -a

# See all tags
git tag
```

---

## Summary

**v2.0 is SAFE** ✅
- Tagged as `v2.0-stable`
- On `main` branch
- Published extension remains untouched
- Can always return to it

**v6.0 is ISOLATED** ✅
- Separate branch: `v6.0-upgrade`
- All changes happen here
- Doesn't affect v2.0
- Can be merged or abandoned

**You can work freely on v6.0 without worrying about v2.0!**

---

**End of Versioning Strategy**


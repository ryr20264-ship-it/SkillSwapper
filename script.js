/* ==========================================================================
   SkillSwapper - script.js (Legacy stub — core logic moved to animation.js v2)
   ========================================================================== */

// All primary logic (loading screen, navbar, counters, typing, toast, etc.)
// is now handled by animation.js v2.0. This file is retained for backwards
// compatibility and any future utility extensions.

/* =========================================================================
   Founder / Team Photo Upload Preview
   ========================================================================= */

/**
 * previewFounderPhoto
 * Called by onchange on each photo file input.
 * @param {HTMLInputElement} input  - The file input element
 * @param {string} avatarId         - ID of the initials/icon avatar div to hide
 * @param {string} imgId            - ID of the <img> element to show with the photo
 */
function previewFounderPhoto(input, avatarId, imgId) {
    const avatar = document.getElementById(avatarId);
    const img    = document.getElementById(imgId);

    if (!input.files || !input.files[0]) {
        // Revert to initials/icon if file cleared
        if (img)    { img.style.display = 'none'; img.src = ''; }
        if (avatar) { avatar.style.display = 'flex'; }
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        if (img) {
            img.src = e.target.result;
            img.style.display = 'block';
        }
        if (avatar) {
            avatar.style.display = 'none';
        }
    };
    reader.readAsDataURL(input.files[0]);
}

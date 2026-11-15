// The lock screen's wallpaper is the shell's own blurred, dimmed background.
// With the setting off we keep the dimming (the clock stays readable) and
// drop the blur radius so the live wallpaper shows sharp.

export function applyLockBlur(backgrounds, blur) {
    if (blur)
        return;
    for (const widget of backgrounds)
        widget.get_effect('blur')?.set({radius: 0});
}

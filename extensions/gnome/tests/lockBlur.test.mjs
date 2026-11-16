// Run with: node --test extensions/gnome/tests/lockBlur.test.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../extension/lockBlur.js', import.meta.url), 'utf8')
    .replace(/^import .*;\n/gm, '')
    .replace(/^export /gm, '');
const {applyLockBlur} = vm.runInNewContext(`${source}\n({applyLockBlur})`, {});

function background(effect) {
    return {get_effect: name => name === 'blur' ? effect : null};
}

test('blur on leaves the lock screen effect as the shell set it', () => {
    const effect = {radius: 90, brightness: 0.65};
    applyLockBlur([background(effect)], true);
    assert.deepEqual(effect, {radius: 90, brightness: 0.65});
});

test('blur off removes the blur radius and keeps the shell dimming', () => {
    const effect = {radius: 90, brightness: 0.65, set(props) { Object.assign(this, props); }};
    applyLockBlur([background(effect)], false);
    assert.equal(effect.radius, 0);
    assert.equal(effect.brightness, 0.65);
});

test('backgrounds without a blur effect, such as Blur my Shell actors, are skipped', () => {
    applyLockBlur([background(null)], false);
});

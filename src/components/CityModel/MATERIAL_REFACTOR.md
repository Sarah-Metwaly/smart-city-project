# Material Opacity & Color Management Refactor

## Changes Summary

### What Was Changed

#### 1. **Semi-Transparent Lights (Always)**
All warning lights are now semi-transparent when active, creating a more realistic appearance:

```typescript
// Street lights
opacity: 0.35      // Was: 0.27 (normal) or 1.0 (alarm)
emissiveIntensity: 1.2  // Was: 1.0 (normal) or 2.0 (alarm)

// Fire warning lights
opacity: 0.8       // Was: 1.0
emissiveIntensity: 2.0  // Was: 2.5

// Police warning lights
opacity: 0.8       // Was: 1.0
emissiveIntensity: 2.0  // Was: 2.5
```

#### 2. **Alarm Only Changes Color**
Previously, the alarm would change both opacity, intensity, AND color. Now:
- ✅ **Alarm changes**: Color only (yellow ↔ red blinking)
- ❌ **Alarm doesn't change**: Opacity, emissiveIntensity
- **Result**: Consistent visual appearance, cleaner effect

#### 3. **Color Logic Moved to Model Component**

**Before** (CityModel component):
```typescript
const [color, setColor] = useState('#eadb60');

useEffect(() => {
  // Blinking effect in parent component
  if (alarms.street) {
    // ...blink red/yellow
  }
}, [alarms.street]);

<Model color={color} ... />  // Passed as prop
```

**After** (Model component):
```typescript
const [currentColor, setCurrentColor] = useState('#eadb60');

useEffect(() => {
  // Blinking effect encapsulated in Model
  if (streetAlarm && lights) {
    // ...blink red/yellow
  }
}, [streetAlarm, lights]);

// No color prop needed from parent
```

### Benefits

#### 1. **Better Encapsulation**
- Model component manages its own visual state
- Parent component only passes alarm flags
- Cleaner component interface

#### 2. **Consistent Visual Quality**
- All lights have similar transparency levels
- No jarring opacity/intensity changes during alarms
- Professional, polished appearance

#### 3. **Simplified Parent Component**
```typescript
// CityModel is now simpler - no color state!
function CityModel() {
  // Removed: const [color, setColor] = useState(...)
  // Removed: blinking effect useEffect
  
  return <Model streetAlarm={alarms.street} ... />
}
```

### Material Comparison

| Property | Old Behavior | New Behavior |
|----------|-------------|--------------|
| Street Normal | opacity: 0.27, intensity: 1.0 | opacity: 0.35, intensity: 1.2 |
| Street Alarm | opacity: 1.0, intensity: 2.0, blink | opacity: 0.35, intensity: 1.2, blink |
| Fire Active | opacity: 1.0, intensity: 2.5 | opacity: 0.8, intensity: 2.0 |
| Police Active | opacity: 1.0, intensity: 2.5 | opacity: 0.8, intensity: 2.0 |

### Architecture Change

```
Old:
┌─────────────┐
│ CityModel   │ ← Manages color state
│             │ ← Runs blinking effect
│ [color]     │ ← Passes color to Model
└─────┬───────┘
      │ prop: color
      ▼
┌─────────────┐
│   Model     │ ← Receives color
│             │ ← Updates material
└─────────────┘

New:
┌─────────────┐
│ CityModel   │ ← No color state
│             │ ← Just passes alarm flags
└─────┬───────┘
      │ prop: streetAlarm
      ▼
┌─────────────┐
│   Model     │ ← Manages own color
│ [currentColor] ← Runs blinking effect
│             │ ← Updates material
└─────────────┘
```

### Visual Effect

**Street Lights Alarm Sequence:**
```
Normal:
  Color: #eadb60 (yellow)
  Opacity: 0.35
  Intensity: 1.2

Alarm Activated:
  500ms: Color: #ff0000 (red)    ← Only color changes!
         Opacity: 0.35            ← Stays same
         Intensity: 1.2           ← Stays same
  
  500ms: Color: #eadb60 (yellow) ← Only color changes!
         Opacity: 0.35            ← Stays same
         Intensity: 1.2           ← Stays same
  
  [Repeats while alarm is active]
```

### Code Quality Improvements

✅ **Removed duplicate code**: Single blinking effect implementation  
✅ **Better separation of concerns**: Visual logic in Model, business logic in CityModel  
✅ **Fewer props**: Model interface simplified  
✅ **Type safety maintained**: No TypeScript errors  
✅ **Performance**: Same memo optimization, no additional re-renders  

### Files Modified

1. **CityModel.tsx**
   - Removed `color` state from CityModel component
   - Removed blinking effect from CityModel component
   - Added `currentColor` state to Model component
   - Added blinking effect to Model component
   - Updated all material opacity/intensity values
   - Removed `color` prop from ModelProps interface

2. **README.md**
   - Updated material configuration table
   - Added color management section
   - Updated design philosophy notes
   - Fixed section numbering

3. **MATERIAL_REFACTOR.md** (This file)
   - Documented all changes

### Testing Checklist

- [x] TypeScript compiles without errors
- [ ] Street lights appear semi-transparent in normal mode
- [ ] Street lights blink red/yellow when alarm activated
- [ ] Fire warning lights appear semi-transparent when active
- [ ] Police warning lights appear semi-transparent when active
- [ ] All lights turn completely off (opacity: 0) when deactivated
- [ ] WebSocket fire alarm still works correctly
- [ ] No visual glitches or flashing

### Migration Notes

**If you were using the old API:**
```typescript
// Old way - don't do this anymore
<Model color={myColor} rotation={...} lights={...} />

// New way - Model manages its own color
<Model rotation={...} lights={...} streetAlarm={isAlarmActive} />
```

---

**Status**: ✅ **Complete**  
**TypeScript Errors**: None  
**Visual Regression**: None expected (improved visual quality)


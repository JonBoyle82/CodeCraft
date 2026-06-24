import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView, Platform, TextInput } from 'react-native';
import { Colors } from '../../constants/colors';

type Block = { id: string; label: string; code: string; color: string };

const BLOCK_CATEGORIES = [
  {
    name: 'Structure',
    blocks: [
      { id: 'h1', label: '<h1>', code: '<h1>My Heading</h1>', color: '#F7971E' },
      { id: 'h2', label: '<h2>', code: '<h2>Sub Heading</h2>', color: '#F7971E' },
      { id: 'p', label: '<p>', code: '<p>My paragraph text goes here.</p>', color: '#F7971E' },
      { id: 'div', label: '<div>', code: '<div>\n  \n</div>', color: '#F7971E' },
    ],
  },
  {
    name: 'Media',
    blocks: [
      { id: 'img', label: '<img>', code: '<img src="https://picsum.photos/200/100" alt="Random image">', color: '#43D9AD' },
      { id: 'a', label: '<a>', code: '<a href="#">Click here</a>', color: '#43D9AD' },
      { id: 'ul', label: '<ul>', code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>', color: '#43D9AD' },
    ],
  },
  {
    name: 'Style',
    blocks: [
      { id: 'css-color', label: 'color', code: '<style>\np { color: purple; }\n</style>', color: '#21D4FD' },
      { id: 'css-bg', label: 'background', code: '<style>\nbody { background-color: #1a1a2e; color: white; }\n</style>', color: '#21D4FD' },
      { id: 'css-center', label: 'center', code: '<style>\nh1 { text-align: center; }\n</style>', color: '#21D4FD' },
      { id: 'css-border', label: 'border', code: '<style>\ndiv { border: 2px solid #6C63FF; padding: 12px; border-radius: 8px; }\n</style>', color: '#21D4FD' },
    ],
  },
  {
    name: 'Interactive',
    blocks: [
      { id: 'btn', label: '<button>', code: '<button onclick="alert(\'Hello!\')">Click Me</button>', color: '#FF6584' },
      { id: 'input', label: '<input>', code: '<input type="text" placeholder="Type here..." id="myInput">', color: '#FF6584' },
      { id: 'js-alert', label: 'JS alert', code: '<script>\nalert("CodeCraft!");\n</script>', color: '#F9F871' },
      { id: 'js-color', label: 'JS color', code: "<script>\ndocument.body.style.backgroundColor = '#6C63FF';\n</script>", color: '#F9F871' },
    ],
  },
];

const SUGGESTIONS: Record<string, string[]> = {
  h1: ['Try adding a <p> below your heading!', 'Style it with a CSS color block.', 'Add an <h2> as a subtitle.'],
  h2: ['Add a <p> paragraph below this.', 'Try a CSS center block to centre it.'],
  p: ['Add a border with a CSS border block.', 'Try changing the color with a CSS color block.'],
  img: ['Add a <p> caption below your image.', 'Wrap it in a <div> to group it.'],
  a: ['Try adding a <button> nearby!', 'Style it with CSS color.'],
  ul: ['Add more items inside the list.', 'Try a CSS border to box the list.'],
  btn: ['Wire it to a JS alert block!', 'Add an <input> next to it.'],
  input: ['Add a <button> to submit!'],
  'css-color': ['Try changing purple to your favourite colour!'],
  'css-bg': ['Combine with a CSS color block for full styling.'],
  div: ['Put other blocks inside the div.', 'Add a CSS border block to see it.'],
  default: ['Drop a block above to get started!', 'Try mixing Structure and Style blocks.'],
};

export default function BuilderScreen() {
  const [droppedBlocks, setDroppedBlocks] = useState<Block[]>([]);
  const [suggestion, setSuggestion] = useState('Drop a block above to get started!');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const combinedCode = droppedBlocks.map((b) => b.code).join('\n');

  function addBlock(block: Block) {
    const newBlocks = [...droppedBlocks, { ...block }];
    setDroppedBlocks(newBlocks);
    const tips = SUGGESTIONS[block.id] ?? SUGGESTIONS.default;
    setSuggestion(tips[Math.floor(Math.random() * tips.length)]);
    setShowPreview(false);
  }

  function removeBlock(index: number) {
    const newBlocks = droppedBlocks.filter((_, i) => i !== index);
    setDroppedBlocks(newBlocks);
    if (newBlocks.length === 0) setSuggestion(SUGGESTIONS.default[0]);
  }

  function updateCode(index: number, text: string) {
    const updated = [...droppedBlocks];
    updated[index] = { ...updated[index], code: text };
    setDroppedBlocks(updated);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>🔨 Code Builder</Text>
        <Text style={styles.sub}>Tap blocks to add them, then preview your creation</Text>

        {/* Suggestion box */}
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionIcon}>💡</Text>
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </View>

        {/* Canvas */}
        <View style={styles.canvas}>
          <Text style={styles.canvasLabel}>YOUR PAGE</Text>
          {droppedBlocks.length === 0 ? (
            <Text style={styles.emptyCanvas}>Tap blocks below to build your page ↓</Text>
          ) : (
            droppedBlocks.map((block, i) => (
              <View key={`${block.id}-${i}`} style={[styles.blockItem, { borderLeftColor: block.color }]}>
                {editingIndex === i ? (
                  <TextInput
                    style={styles.blockEditor}
                    value={block.code}
                    onChangeText={(t) => updateCode(i, t)}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                  />
                ) : (
                  <Pressable onPress={() => setEditingIndex(i)} style={Platform.OS === 'web' ? ({ cursor: 'text' } as any) : undefined}>
                    <Text style={styles.blockCode}>{block.code}</Text>
                  </Pressable>
                )}
                <View style={styles.blockActions}>
                  <Pressable onPress={() => setEditingIndex(editingIndex === i ? null : i)} style={styles.editBtn}>
                    <Text style={styles.editBtnText}>{editingIndex === i ? '✓ Done' : '✏️ Edit'}</Text>
                  </Pressable>
                  <Pressable onPress={() => removeBlock(i)} style={styles.removeBtn}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Preview / Clear buttons */}
        {droppedBlocks.length > 0 && (
          <View style={styles.btnRow}>
            <Pressable style={styles.secondaryBtn} onPress={() => { setDroppedBlocks([]); setSuggestion(SUGGESTIONS.default[0]); setShowPreview(false); }}>
              <Text style={styles.secondaryBtnText}>Clear All</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={() => setShowPreview(!showPreview)}>
              <Text style={styles.primaryBtnText}>{showPreview ? 'Hide Preview' : '▶ Preview'}</Text>
            </Pressable>
          </View>
        )}

        {/* Live Preview — web only via iframe */}
        {showPreview && Platform.OS === 'web' && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
            <iframe
              srcDoc={combinedCode}
              style={{ width: '100%', height: 320, border: 'none', borderRadius: 10, background: 'white' }}
              sandbox="allow-scripts"
              title="preview"
            />
          </View>
        )}

        {showPreview && Platform.OS !== 'web' && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>GENERATED CODE</Text>
            <ScrollView horizontal>
              <Text style={styles.codeOutput}>{combinedCode}</Text>
            </ScrollView>
          </View>
        )}

        {/* Block palette */}
        {BLOCK_CATEGORIES.map((cat) => (
          <View key={cat.name} style={styles.category}>
            <Text style={styles.categoryName}>{cat.name}</Text>
            <View style={styles.blockGrid}>
              {cat.blocks.map((block) => (
                <Pressable
                  key={block.id}
                  style={({ pressed }) => [
                    styles.paletteBlock,
                    { borderColor: block.color, opacity: pressed ? 0.7 : 1 },
                    Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                  ]}
                  onPress={() => addBlock(block)}
                >
                  <Text style={[styles.paletteLabel, { color: block.color }]}>{block.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 60 },
  heading: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  sub: { fontSize: 14, color: Colors.textMuted, marginBottom: 16 },
  suggestionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 20, gap: 10, borderLeftWidth: 3, borderLeftColor: Colors.xp },
  suggestionIcon: { fontSize: 20 },
  suggestionText: { flex: 1, color: Colors.xp, fontSize: 14, lineHeight: 20 },
  canvas: { backgroundColor: Colors.card, borderRadius: 14, padding: 16, marginBottom: 16, minHeight: 100, borderWidth: 1, borderColor: Colors.surface, borderStyle: 'dashed' },
  canvasLabel: { fontSize: 11, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 12 },
  emptyCanvas: { color: Colors.textMuted, fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  blockItem: { backgroundColor: Colors.surface, borderRadius: 8, padding: 10, marginBottom: 8, borderLeftWidth: 3 },
  blockCode: { fontFamily: 'monospace', fontSize: 12, color: Colors.accent, lineHeight: 18 },
  blockEditor: { fontFamily: 'monospace', fontSize: 12, color: Colors.accent, lineHeight: 18, minHeight: 60, textAlignVertical: 'top' },
  blockActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 6 },
  editBtn: { backgroundColor: Colors.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  editBtnText: { fontSize: 12, color: Colors.primary },
  removeBtn: { backgroundColor: Colors.card, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  removeBtnText: { fontSize: 12, color: Colors.error },
  btnRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  primaryBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  secondaryBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 14, alignItems: 'center' },
  secondaryBtnText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
  previewContainer: { backgroundColor: Colors.card, borderRadius: 12, padding: 12, marginBottom: 20 },
  previewLabel: { fontSize: 11, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 10 },
  codeOutput: { fontFamily: 'monospace', fontSize: 12, color: Colors.accent, lineHeight: 18 },
  category: { marginBottom: 20 },
  categoryName: { fontSize: 13, fontWeight: 'bold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  blockGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  paletteBlock: { backgroundColor: Colors.card, borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  paletteLabel: { fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace' },
});

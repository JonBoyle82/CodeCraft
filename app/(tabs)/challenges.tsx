import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';

export const challenges = [
  { id: 'c1', title: 'Build a Profile Page', difficulty: 'Easy', track: 'HTML', xp: 100, emoji: '👤', description: 'Use HTML to build a personal profile page with a heading, a short bio paragraph, and an unordered list of your hobbies.', starterCode: '<!-- Build your profile page here -->\n<h1>Your Name</h1>\n', solution: '<h1>Jane Doe</h1>\n<p>Hi! I love coding and gaming.</p>\n<ul>\n  <li>Coding</li>\n  <li>Gaming</li>\n  <li>Reading</li>\n</ul>', hint: 'Use <h1> for your name, <p> for your bio, and <ul> with <li> items for hobbies.' },
  { id: 'c2', title: 'Style a Menu', difficulty: 'Easy', track: 'CSS', xp: 120, emoji: '🎨', description: 'Write CSS to style a navigation menu. Make the background dark, text white, and add a hover colour change.', starterCode: '/* Style the nav and nav a elements */\nnav {\n\n}\nnav a {\n\n}\nnav a:hover {\n\n}', solution: 'nav {\n  background-color: #333;\n  padding: 10px;\n}\nnav a {\n  color: white;\n  text-decoration: none;\n  margin: 0 10px;\n}\nnav a:hover {\n  color: #6C63FF;\n}', hint: 'Set background-color on nav, color: white on nav a, and a different color on nav a:hover.' },
  { id: 'c3', title: 'Click Counter', difficulty: 'Medium', track: 'JS', xp: 200, emoji: '🖱️', description: 'Write JavaScript that counts how many times a button is clicked and displays the count on the page.', starterCode: '// Track the count and update the display\nlet count = 0;\n\nfunction handleClick() {\n  // Add your code here\n}', solution: 'let count = 0;\n\nfunction handleClick() {\n  count++;\n  document.getElementById("display").textContent = "Count: " + count;\n}', hint: 'Increment count with count++, then update a DOM element\'s textContent.' },
  { id: 'c4', title: 'Number Guesser', difficulty: 'Medium', track: 'Python', xp: 180, emoji: '🎲', description: 'Write a Python program that picks a random number 1–10 and lets the user guess until they get it right.', starterCode: 'import random\n\nsecret = random.randint(1, 10)\n# Write your guessing loop here', solution: 'import random\n\nsecret = random.randint(1, 10)\nguess = 0\nwhile guess != secret:\n    guess = int(input("Guess (1-10): "))\n    if guess < secret:\n        print("Too low!")\n    elif guess > secret:\n        print("Too high!")\nprint("Correct!")', hint: 'Use a while loop that keeps running until guess equals secret.' },
  { id: 'c5', title: 'Dark Mode Toggle', difficulty: 'Hard', track: 'CSS + JS', xp: 300, emoji: '🌙', description: 'Build a dark mode toggle. Clicking a button switches the page between a light and dark theme using a CSS class.', starterCode: '// Toggle a "dark" class on document.body\nfunction toggleDark() {\n  // Your code here\n}', solution: 'function toggleDark() {\n  document.body.classList.toggle("dark");\n}', hint: 'Use document.body.classList.toggle("dark") — it adds the class if missing, removes it if present.' },
  { id: 'c6', title: 'FizzBuzz', difficulty: 'Easy', track: 'Python', xp: 100, emoji: '🔢', description: 'The classic! Print numbers 1–30. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for both print "FizzBuzz".', starterCode: '# Write FizzBuzz for numbers 1 to 30\n', solution: 'for i in range(1, 31):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)', hint: 'Check for multiples of both 3 AND 5 first (i % 15 == 0), then check each separately.' },
  { id: 'c7', title: 'Java Calculator', difficulty: 'Medium', track: 'Java', xp: 220, emoji: '🧮', description: 'Write a Java method that takes two numbers and an operator (+, -, *, /) as a char, and returns the result.', starterCode: 'public static double calculate(double a, double b, char op) {\n    // Return the result based on op\n}', solution: 'public static double calculate(double a, double b, char op) {\n    if (op == \'+\') return a + b;\n    if (op == \'-\') return a - b;\n    if (op == \'*\') return a * b;\n    if (op == \'/\') return a / b;\n    return 0;\n}', hint: 'Use a series of if statements comparing op to each operator character.' },
  { id: 'c8', title: 'Delphi Grade Checker', difficulty: 'Easy', track: 'Delphi', xp: 110, emoji: '📝', description: 'Write a Delphi program that reads a score (0-100) and prints the grade: A (90+), B (70+), C (50+), or F.', starterCode: "program GradeChecker;\nvar\n  score: Integer;\nbegin\n  score := 75; // Change this to test\n  // Write your if/then/else here\nend.", solution: "program GradeChecker;\nvar\n  score: Integer;\nbegin\n  score := 75;\n  if score >= 90 then\n    WriteLn('A')\n  else if score >= 70 then\n    WriteLn('B')\n  else if score >= 50 then\n    WriteLn('C')\n  else\n    WriteLn('F');\nend.", hint: 'Use nested if/else if in Delphi. Remember: no semicolon before else!' },
];

const difficultyColor: Record<string, string> = {
  Easy: Colors.success,
  Medium: Colors.xp,
  Hard: Colors.error,
};

export default function ChallengesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>⚔️ Challenges</Text>
        <Text style={styles.sub}>Test your skills and earn bonus XP</Text>

        {challenges.map((c) => (
          <Pressable
            key={c.id}
            style={({ pressed }) => [
              styles.card,
              { opacity: pressed ? 0.8 : 1 },
              Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
            ]}
            onPress={() => router.push({ pathname: '/challenge/[id]', params: { id: c.id } })}
          >
            <Text style={styles.emoji}>{c.emoji}</Text>
            <View style={styles.info}>
              <Text style={styles.title}>{c.title}</Text>
              <Text style={styles.track}>{c.track}</Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.diff, { color: difficultyColor[c.difficulty] ?? Colors.textMuted }]}>
                {c.difficulty}
              </Text>
              <Text style={styles.xp}>+{c.xp} XP</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  heading: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  sub: { fontSize: 14, color: Colors.textMuted, marginBottom: 24 },
  card: { backgroundColor: Colors.card, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: Colors.text },
  track: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  diff: { fontSize: 12, fontWeight: 'bold' },
  xp: { fontSize: 13, color: Colors.xp, fontWeight: 'bold', marginTop: 4 },
});

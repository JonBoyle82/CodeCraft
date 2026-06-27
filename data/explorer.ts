export type TagInfo = {
  tag: string;
  label: string;
  description: string;
  example: string;
  pairsWith?: string;
  category: string;
};

export type SequencerChallenge = {
  id: string;
  goal: string;
  tokens: string[];
  distractors: string[];
  xp: number;
};

export type TrackExplorer = {
  trackId: string;
  trackName: string;
  icon: string;
  color: string;
  categories: string[];
  tags: TagInfo[];
  challenges: SequencerChallenge[];
};

const htmlExplorer: TrackExplorer = {
  trackId: 'html',
  trackName: 'HTML',
  icon: '🌐',
  color: '#F7971E',
  categories: ['All', 'Structure', 'Text', 'Links', 'Lists', 'Forms', 'Semantic'],
  tags: [
    { tag: '<html>', label: 'HTML Root', category: 'Structure', pairsWith: '</html>', description: 'The root element that wraps your entire web page. Every HTML file has exactly one.', example: '<html>\n  <head>...</head>\n  <body>...</body>\n</html>' },
    { tag: '<head>', label: 'Document Head', category: 'Structure', pairsWith: '</head>', description: 'Contains metadata like the page title and CSS links. Nothing in here is visible on the page.', example: '<head>\n  <title>My Page</title>\n</head>' },
    { tag: '<body>', label: 'Document Body', category: 'Structure', pairsWith: '</body>', description: 'Everything the user sees on the page lives inside here.', example: '<body>\n  <h1>Hello!</h1>\n</body>' },
    { tag: '<h1>', label: 'Heading 1', category: 'Text', pairsWith: '</h1>', description: 'The biggest heading. Use only once per page — like the title of a book.', example: '<h1>Welcome to CodeCraft</h1>' },
    { tag: '<p>', label: 'Paragraph', category: 'Text', pairsWith: '</p>', description: 'A block of text. The browser automatically adds space above and below it.', example: '<p>This is a paragraph of text.</p>' },
    { tag: '<a>', label: 'Link', category: 'Links', pairsWith: '</a>', description: 'Creates a clickable hyperlink. The href attribute sets where it goes.', example: '<a href="https://google.com">Go to Google</a>' },
    { tag: '<img>', label: 'Image', category: 'Links', description: 'Embeds an image. Self-closing — no closing tag needed! Always include an alt attribute.', example: '<img src="cat.jpg" alt="A cute cat">' },
    { tag: '<ul>', label: 'Unordered List', category: 'Lists', pairsWith: '</ul>', description: 'A bullet-point list. Must contain <li> items inside.', example: '<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n</ul>' },
    { tag: '<li>', label: 'List Item', category: 'Lists', pairsWith: '</li>', description: 'A single item inside a <ul> or <ol> list.', example: '<li>Item one</li>' },
    { tag: '<div>', label: 'Division', category: 'Structure', pairsWith: '</div>', description: 'An invisible block container for grouping elements. Becomes powerful when styled with CSS.', example: '<div class="card">\n  <p>Content here</p>\n</div>' },
    { tag: '<form>', label: 'Form', category: 'Forms', pairsWith: '</form>', description: 'Wraps input fields to collect data from users.', example: '<form>\n  <input type="text">\n  <button>Submit</button>\n</form>' },
    { tag: '<input>', label: 'Input', category: 'Forms', description: 'A field for user input — text, email, checkbox, and more. Self-closing tag.', example: '<input type="text" placeholder="Your name">' },
    { tag: '<header>', label: 'Header', category: 'Semantic', pairsWith: '</header>', description: 'The top section of a page or article. Tells browsers and screen readers this is the header.', example: '<header>\n  <h1>My Site</h1>\n</header>' },
    { tag: '<footer>', label: 'Footer', category: 'Semantic', pairsWith: '</footer>', description: 'The bottom section. Usually holds copyright info, social links, and contact details.', example: '<footer>\n  <p>© 2026 My Site</p>\n</footer>' },
  ],
  challenges: [
    { id: 'html-seq-1', goal: 'Build a clickable link that says "Visit Google"', tokens: ['<a href="url">', 'Visit Google', '</a>'], distractors: ['<p>', '</p>'], xp: 30 },
    { id: 'html-seq-2', goal: 'Build a 2-item bullet list', tokens: ['<ul>', '<li>Item 1</li>', '<li>Item 2</li>', '</ul>'], distractors: ['<ol>', '</div>'], xp: 40 },
    { id: 'html-seq-3', goal: 'Wrap a heading and paragraph inside a div', tokens: ['<div>', '<h1>Title</h1>', '<p>Content here.</p>', '</div>'], distractors: ['</h1>', '<span>'], xp: 50 },
    { id: 'html-seq-4', goal: 'Build the skeleton of an HTML page', tokens: ['<html>', '<head>', '</head>', '<body>', '</body>', '</html>'], distractors: ['<div>', '<span>'], xp: 40 },
    { id: 'html-seq-5', goal: 'Wrap a heading in a header and add a footer', tokens: ['<header>', '<h1>My Site</h1>', '</header>', '<footer>', '<p>© 2026</p>', '</footer>'], distractors: ['<div>', '<nav>'], xp: 45 },
    { id: 'html-seq-6', goal: 'Build a simple signup form', tokens: ['<form>', '<input type="text" placeholder="Name">', '<button type="submit">Sign Up</button>', '</form>'], distractors: ['<div>', '<p>Submit</p>'], xp: 45 },
    { id: 'html-seq-7', goal: 'Add an image with a source and alt text', tokens: ['<img src="photo.jpg" alt="A photo">'], distractors: ['<img src="photo.jpg">', '<picture alt="A photo">'], xp: 25 },
  ],
};

const cssExplorer: TrackExplorer = {
  trackId: 'css',
  trackName: 'CSS',
  icon: '🎨',
  color: '#21D4FD',
  categories: ['All', 'Colors', 'Typography', 'Box Model', 'Layout', 'Effects'],
  tags: [
    { tag: 'color', label: 'Text Color', category: 'Colors', description: 'Sets the color of text. Use named colors, hex codes (#ff0000), or rgb() values.', example: 'p {\n  color: #6C63FF;\n}' },
    { tag: 'background-color', label: 'Background Color', category: 'Colors', description: 'Sets the background fill of an element.', example: 'body {\n  background-color: #0F0E17;\n}' },
    { tag: 'font-size', label: 'Font Size', category: 'Typography', description: 'Sets how big the text is. Use px for fixed pixels or rem for scalable sizes.', example: 'h1 {\n  font-size: 48px;\n}' },
    { tag: 'font-weight', label: 'Font Weight', category: 'Typography', description: "Controls how bold the text is. Use bold, normal, or numbers like 700.", example: 'h2 {\n  font-weight: bold;\n}' },
    { tag: 'text-align', label: 'Text Align', category: 'Typography', description: 'Aligns text left, right, center, or justify inside its container.', example: '.title {\n  text-align: center;\n}' },
    { tag: 'padding', label: 'Padding', category: 'Box Model', description: 'Space INSIDE the element border, between the border and the content.', example: '.card {\n  padding: 20px;\n}' },
    { tag: 'margin', label: 'Margin', category: 'Box Model', description: 'Space OUTSIDE the element border, pushing other elements away.', example: '.section {\n  margin: 24px 0;\n}' },
    { tag: 'border', label: 'Border', category: 'Box Model', description: 'A visible line around the element. Set the thickness, style, and color.', example: '.box {\n  border: 2px solid #6C63FF;\n}' },
    { tag: 'display', label: 'Display', category: 'Layout', description: 'Controls how an element is laid out. Key values: block, inline, flex, grid.', example: '.container {\n  display: flex;\n}' },
    { tag: 'justify-content', label: 'Justify Content', category: 'Layout', description: 'In a flex container, spaces children along the main axis (horizontal by default).', example: '.nav {\n  display: flex;\n  justify-content: space-between;\n}' },
    { tag: 'align-items', label: 'Align Items', category: 'Layout', description: 'In a flex container, aligns children on the cross axis (vertical by default).', example: '.hero {\n  display: flex;\n  align-items: center;\n}' },
    { tag: 'border-radius', label: 'Border Radius', category: 'Effects', description: 'Rounds the corners of an element. Use 50% to make a perfect circle.', example: '.btn {\n  border-radius: 12px;\n}' },
  ],
  challenges: [
    { id: 'css-seq-1', goal: 'Write a CSS rule to make h1 purple and centred', tokens: ['h1 {', 'color: purple;', 'text-align: center;', '}'], distractors: ['font-size: 16px;', '.h1 {'], xp: 30 },
    { id: 'css-seq-2', goal: 'Create a flex container that centres its children', tokens: ['.container {', 'display: flex;', 'justify-content: center;', 'align-items: center;', '}'], distractors: ['display: block;', 'margin: 0;'], xp: 40 },
    { id: 'css-seq-3', goal: 'Style .card with padding, border, and rounded corners', tokens: ['.card {', 'padding: 20px;', 'border: 2px solid black;', 'border-radius: 12px;', '}'], distractors: ['margin: 20px;', 'color: red;'], xp: 50 },
    { id: 'css-seq-4', goal: 'Style body with a dark background and large font size', tokens: ['body {', 'background-color: #1a1a2e;', 'font-size: 18px;', '}'], distractors: ['background: blue;', 'font: 18;'], xp: 35 },
    { id: 'css-seq-5', goal: 'Style h2 with bold text and vertical margin', tokens: ['h2 {', 'font-weight: bold;', 'margin: 24px 0;', '}'], distractors: ['font-bold: true;', 'margin-top: 0;'], xp: 35 },
  ],
};

const jsExplorer: TrackExplorer = {
  trackId: 'js',
  trackName: 'JavaScript',
  icon: '⚡',
  color: '#F9F871',
  categories: ['All', 'Variables', 'Functions', 'Control Flow', 'Arrays', 'DOM'],
  tags: [
    { tag: 'const', label: 'Constant', category: 'Variables', description: "Declares a variable whose value won't change. Use for values you set once and keep.", example: "const name = 'Alex';\nconst PI = 3.14;" },
    { tag: 'let', label: 'Variable', category: 'Variables', description: 'Declares a variable that can change later. Use when the value will be updated.', example: "let score = 0;\nscore = score + 10;" },
    { tag: 'function', label: 'Function', category: 'Functions', description: 'A reusable block of code. Define it once, call it anywhere.', example: 'function greet(name) {\n  return "Hello, " + name;\n}' },
    { tag: 'return', label: 'Return', category: 'Functions', description: 'Sends a value back from a function. Code after return is not executed.', example: 'function double(n) {\n  return n * 2;\n}' },
    { tag: 'if / else', label: 'If / Else', category: 'Control Flow', description: 'Runs different code depending on a condition. Always use === not == for comparisons.', example: 'if (score >= 90) {\n  console.log("A grade");\n} else {\n  console.log("Try again");\n}' },
    { tag: 'for', label: 'For Loop', category: 'Control Flow', description: 'Repeats code a set number of times. Has three parts: start, condition, and step.', example: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}' },
    { tag: 'console.log()', label: 'Console Log', category: 'Variables', description: 'Prints a value to the browser console. Your best debugging friend!', example: "console.log('Hello!');\nconsole.log(42 + 8);" },
    { tag: '[ ]  Array', label: 'Array', category: 'Arrays', description: 'A list of values in one variable. Access items by index starting at 0.', example: "const fruits = ['apple', 'banana'];\nconsole.log(fruits[0]);" },
    { tag: '{ }  Object', label: 'Object', category: 'Arrays', description: 'Groups related data as key-value pairs. Access values with dot notation.', example: "const player = { name: 'Sam', score: 100 };\nconsole.log(player.name);" },
    { tag: 'document.getElementById()', label: 'Get Element', category: 'DOM', description: 'Grabs an HTML element by its id so you can read or change it with JavaScript.', example: "const btn = document.getElementById('myBtn');" },
    { tag: 'addEventListener()', label: 'Event Listener', category: 'DOM', description: "Watches for an event like 'click' and runs a function when it fires.", example: "btn.addEventListener('click', function() {\n  alert('Clicked!');\n});" },
    { tag: 'arrow function', label: 'Arrow Function', category: 'Functions', description: 'A shorter way to write a function. Great for one-liners!', example: 'const add = (a, b) => a + b;\nconsole.log(add(3, 4));' },
  ],
  challenges: [
    { id: 'js-seq-1', goal: 'Declare a const variable and log it', tokens: ["const name = 'Alex';", 'console.log(name);'], distractors: ['let name;', 'return name;'], xp: 25 },
    { id: 'js-seq-2', goal: 'Write a function that doubles a number', tokens: ['function double(n) {', 'return n * 2;', '}'], distractors: ['return n + 2;', 'const double = n;'], xp: 35 },
    { id: 'js-seq-3', goal: 'Write a for loop that logs 1, 2, 3', tokens: ['for (let i = 1; i <= 3; i++) {', 'console.log(i);', '}'], distractors: ['while (i <= 3) {', 'for (let i = 0; i < 3; i--) {'], xp: 40 },
    { id: 'js-seq-4', goal: 'Declare a let score and check if it passes', tokens: ['let score = 75;', 'if (score >= 50) {', "console.log('Passing!');", '}'], distractors: ['const score = 75;', 'if score >= 50 {'], xp: 35 },
    { id: 'js-seq-5', goal: 'Create an array and log its first item', tokens: ["const fruits = ['apple', 'banana'];", 'console.log(fruits[0]);'], distractors: ["const fruits = ('apple', 'banana');", 'console.log(fruits[1]);'], xp: 30 },
    { id: 'js-seq-6', goal: 'Write an arrow function that adds two numbers', tokens: ['const add = (a, b) => a + b;', 'console.log(add(3, 4));'], distractors: ['const add = (a, b) { return a + b };', 'console.log(add);'], xp: 35 },
  ],
};

const pythonExplorer: TrackExplorer = {
  trackId: 'python',
  trackName: 'Python',
  icon: '🐍',
  color: '#4BC0C8',
  categories: ['All', 'Output', 'Variables', 'Control Flow', 'Loops', 'Functions', 'Data'],
  tags: [
    { tag: 'print()', label: 'Print', category: 'Output', description: 'Outputs text or values to the screen. The most-used function when learning Python!', example: "print('Hello, world!')\nprint(42)" },
    { tag: 'input()', label: 'Input', category: 'Output', description: 'Pauses the program and waits for the user to type something. Always returns a string.', example: "name = input('What is your name? ')\nprint('Hello,', name)" },
    { tag: '= (assign)', label: 'Variable', category: 'Variables', description: 'Creates a variable. No keyword needed — just write name = value.', example: "player_name = 'Sam'\nhigh_score = 250" },
    { tag: 'int()', label: 'int() Convert', category: 'Variables', description: 'Converts a string into a whole number. Essential when using input() for maths.', example: "age = int(input('How old? '))\nprint(age + 1)" },
    { tag: 'if / elif / else', label: 'If Statement', category: 'Control Flow', description: 'Makes decisions. Python uses indentation (4 spaces) instead of curly braces!', example: "if score >= 90:\n    print('A grade')\nelif score >= 70:\n    print('B grade')\nelse:\n    print('Keep going!')" },
    { tag: 'for', label: 'For Loop', category: 'Loops', description: 'Repeats code for each item in a range or list. Use range() to generate numbers.', example: 'for i in range(1, 6):\n    print(i)' },
    { tag: 'while', label: 'While Loop', category: 'Loops', description: 'Keeps repeating as long as a condition is True. Make sure it eventually stops!', example: "count = 3\nwhile count > 0:\n    print(count)\n    count -= 1" },
    { tag: 'def', label: 'Function', category: 'Functions', description: 'Defines a reusable function. Use return to send a value back.', example: "def greet(name):\n    return 'Hello, ' + name\n\nprint(greet('Maya'))" },
    { tag: 'return', label: 'Return', category: 'Functions', description: 'Sends a value back from a function. Code after return is not executed.', example: 'def square(n):\n    return n * n' },
    { tag: 'list [ ]', label: 'List', category: 'Data', description: 'An ordered collection of items. Add with .append(), count with len().', example: "games = ['Minecraft', 'Roblox']\ngames.append('Fortnite')\nprint(len(games))" },
    { tag: "dict { }", label: 'Dictionary', category: 'Data', description: "Stores key-value pairs like a lookup table. Access values with dict['key'].", example: "player = {'name': 'Zara', 'level': 5}\nprint(player['name'])" },
    { tag: 'len()', label: 'Length', category: 'Data', description: 'Returns the number of items in a list, string, or dictionary.', example: "fruits = ['apple', 'banana', 'mango']\nprint(len(fruits))  # 3" },
  ],
  challenges: [
    { id: 'py-seq-1', goal: 'Store a name in a variable and print a greeting', tokens: ["name = 'Alex'", "print('Hello,', name)"], distractors: ['input(name)', 'return name'], xp: 25 },
    { id: 'py-seq-2', goal: 'Define a function that returns a number squared', tokens: ['def square(n):', '    return n * n'], distractors: ['    return n + n', 'function square(n):'], xp: 35 },
    { id: 'py-seq-3', goal: 'Write a for loop that prints 1, 2, 3', tokens: ['for i in range(1, 4):', '    print(i)'], distractors: ['for i in range(0, 3):', '    return i'], xp: 35 },
    { id: 'py-seq-4', goal: 'Check a score with if/else', tokens: ['if score >= 90:', "    print('A grade')", 'else:', "    print('Keep going!')"], distractors: ['if (score >= 90) {', "print('A grade')"], xp: 35 },
    { id: 'py-seq-5', goal: 'Add an item to a list and print its length', tokens: ['games = []', "games.append('Minecraft')", 'print(len(games))'], distractors: ['games = {}', 'print(games.length)'], xp: 35 },
    { id: 'py-seq-6', goal: 'Use a while loop to count down from 3', tokens: ['count = 3', 'while count > 0:', '    print(count)', '    count -= 1'], distractors: ['while (count > 0):', '    count--'], xp: 40 },
  ],
};

const javaExplorer: TrackExplorer = {
  trackId: 'java',
  trackName: 'Java',
  icon: '☕',
  color: '#FF8C42',
  categories: ['All', 'Variables', 'Output', 'Control Flow', 'Methods', 'OOP'],
  tags: [
    { tag: 'int', label: 'Integer', category: 'Variables', description: 'Stores a whole number. Java requires you to declare the type before the variable name.', example: 'int score = 100;\nint lives = 3;' },
    { tag: 'String', label: 'String', category: 'Variables', description: 'Stores text. Note the capital S — String is a class in Java, not a primitive type.', example: 'String name = "Alex";\nSystem.out.println(name);' },
    { tag: 'boolean', label: 'Boolean', category: 'Variables', description: 'Stores true or false. Used for conditions and flags.', example: 'boolean isAlive = true;\nboolean gameOver = false;' },
    { tag: 'System.out.println()', label: 'Print Line', category: 'Output', description: "Prints a value to the console with a newline. Java's equivalent of print().", example: 'System.out.println("Hello, World!");\nSystem.out.println(42);' },
    { tag: 'if / else', label: 'If / Else', category: 'Control Flow', description: 'Same logic as other languages. Requires curly braces and parentheses around the condition.', example: 'if (score >= 90) {\n    System.out.println("A grade");\n} else {\n    System.out.println("Try again");\n}' },
    { tag: 'for', label: 'For Loop', category: 'Control Flow', description: 'Repeats code a set number of times. Identical syntax to JavaScript.', example: 'for (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}' },
    { tag: 'public static void main', label: 'Main Method', category: 'Methods', description: 'The entry point of every Java program. The JVM runs this first.', example: 'public static void main(String[] args) {\n    System.out.println("Running!");\n}' },
    { tag: 'return', label: 'Return', category: 'Methods', description: 'Sends a value back from a method. The return type in the method signature must match.', example: 'public int doubleIt(int n) {\n    return n * 2;\n}' },
    { tag: 'class', label: 'Class', category: 'OOP', description: 'The blueprint for objects. In Java, all code must live inside a class.', example: 'public class Player {\n    String name;\n    int score;\n}' },
    { tag: 'public / private', label: 'Access Modifiers', category: 'OOP', description: 'public means anyone can access it. private means only the class itself can.', example: 'public class Dog {\n    private String name;\n    public String getName() {\n        return name;\n    }\n}' },
  ],
  challenges: [
    { id: 'java-seq-1', goal: 'Print "Hello World" to the console', tokens: ['System.out.println(', '"Hello World"', ');'], distractors: ['print(', '"Hello World";'], xp: 25 },
    { id: 'java-seq-2', goal: 'Declare an int variable called score set to 100', tokens: ['int', 'score', '=', '100;'], distractors: ['String', 'var', '=='], xp: 30 },
    { id: 'java-seq-3', goal: 'Write an if statement that checks if score is over 90', tokens: ['if (score > 90) {', 'System.out.println("Excellent!");', '}'], distractors: ['if score > 90:', 'println("Excellent!");'], xp: 40 },
    { id: 'java-seq-4', goal: 'Write a for loop that prints 1 to 5', tokens: ['for (int i = 1; i <= 5; i++) {', 'System.out.println(i);', '}'], distractors: ['for (i = 1; i < 5; i++)', 'print(i);'], xp: 40 },
    { id: 'java-seq-5', goal: 'Write the skeleton of a Java class with a main method', tokens: ['public class Main {', 'public static void main(String[] args) {', 'System.out.println("Hello!");', '}', '}'], distractors: ['class main {', 'static public void Main() {'], xp: 50 },
  ],
};

const delphiExplorer: TrackExplorer = {
  trackId: 'delphi',
  trackName: 'Delphi',
  icon: '🏆',
  color: '#B24BF3',
  categories: ['All', 'Structure', 'Variables', 'Control Flow', 'Procedures'],
  tags: [
    { tag: 'program', label: 'Program Declaration', category: 'Structure', description: 'Declares the name of your Delphi program. Must be the very first line.', example: "program HelloWorld;\nbegin\n  writeln('Hello!');\nend." },
    { tag: 'begin / end', label: 'Begin / End', category: 'Structure', description: 'Block delimiters — like { } in other languages. The final end in the program ends with a period.', example: "begin\n  writeln('Hi!');\nend." },
    { tag: 'writeln()', label: 'Writeln', category: 'Structure', description: "Prints a line of text to the console. Like Python's print() or Java's System.out.println().", example: "writeln('Hello, World!');\nwriteln(42);" },
    { tag: 'var', label: 'Var Section', category: 'Variables', description: 'Declares all variables before the begin block. Every variable needs a type.', example: "var\n  score: Integer;\n  name: String;\nbegin\n  score := 100;\nend." },
    { tag: ':=', label: 'Assignment', category: 'Variables', description: 'Assigns a value to a variable. Delphi uses := instead of just = for assignment.', example: "score := 100;\nname := 'Alex';" },
    { tag: 'Integer / String', label: 'Data Types', category: 'Variables', description: 'Integer stores whole numbers. String stores text. Declared in the var section.', example: "var\n  age: Integer;\n  greeting: String;" },
    { tag: 'if / then / else', label: 'If / Then / Else', category: 'Control Flow', description: 'Makes decisions. Use then instead of { and a semicolon before else.', example: "if score >= 90 then\n  writeln('Excellent!')\nelse\n  writeln('Keep trying!');" },
    { tag: 'for / to / do', label: 'For Loop', category: 'Control Flow', description: 'Counts from a start value to an end value. Use do before the loop body.', example: 'for i := 1 to 5 do\n  writeln(i);' },
    { tag: 'procedure', label: 'Procedure', category: 'Procedures', description: "A named block of code that doesn't return a value. Like a void function.", example: "procedure Greet(name: String);\nbegin\n  writeln('Hello, ', name);\nend;" },
    { tag: 'function', label: 'Function', category: 'Procedures', description: 'Like a procedure but returns a value. Assign the result to the function name inside.', example: 'function Square(n: Integer): Integer;\nbegin\n  Result := n * n;\nend;' },
  ],
  challenges: [
    { id: 'delphi-seq-1', goal: "Print 'Hello World' using writeln", tokens: ["writeln(", "'Hello World'", ");"], distractors: ["print(", "'Hello World';"], xp: 25 },
    { id: 'delphi-seq-2', goal: 'Write a complete begin/end block that prints a greeting', tokens: ['begin', "writeln('Hello!');", 'end.'], distractors: ['program;', 'end;'], xp: 35 },
    { id: 'delphi-seq-3', goal: 'Write an if/then that checks if score > 90', tokens: ['if score > 90 then', "writeln('Excellent!');"], distractors: ['if (score > 90) {', 'then writeln;'], xp: 35 },
    { id: 'delphi-seq-4', goal: 'Write a Delphi program that declares a variable and prints it', tokens: ['program MyApp;', 'var', '  score: Integer;', 'begin', '  score := 100;', '  writeln(score);', 'end.'], distractors: ['app MyApp;', 'score = 100;'], xp: 50 },
    { id: 'delphi-seq-5', goal: 'Write a for loop that counts to 5', tokens: ['for i := 1 to 5 do', '  writeln(i);'], distractors: ['for i = 1 to 5', '  print(i);'], xp: 35 },
    { id: 'delphi-seq-6', goal: 'Define a procedure that prints a greeting', tokens: ['procedure Greet(name: String);', 'begin', "  writeln('Hello, ', name);", 'end;'], distractors: ['void Greet(name) {', 'function Greet:'], xp: 45 },
  ],
};

export const explorerData: TrackExplorer[] = [
  htmlExplorer,
  cssExplorer,
  jsExplorer,
  pythonExplorer,
  javaExplorer,
  delphiExplorer,
];

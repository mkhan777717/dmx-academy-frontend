// Flutter Development Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "fl-phase-1",
    title: "Phase 1: Dart Programming & Widgets Layout Trees (Weeks 1–2)",
    description: "Learn Dart type systems, asynchronous Futures/Streams, standard layout widget trees, and form handlers.",
    modules: [
      {
        id: "fl-m-1",
        title: "Module 1: Dart Programming Foundations",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Explain Dart static types, null-safety configurations, and control structures",
          "Apply OOP principles using classes, constructors, and mixins",
          "Implement async processing using Futures, Streams, and async/await syntax"
        ],
        lessons: [
          {
            id: "fl-l-1-1",
            title: "Dart Variables, Types & Control Flows",
            time: "40 min",
            summary: "Dart type systems, var vs final vs const, sound null safety, and basic operators.",
            content: `
### Dart Variables, Types & Control Flows

Dart is a client-optimized language developed by Google for fast apps on any platform. It is statically typed, supporting type inference and sound null safety.

#### Core Concepts:
* **Var vs. Final vs. Const:**
  * \`var\`: Inferred type, variable can be reassigned.
  * \`final\`: Single-assignment variable, computed at runtime.
  * \`const\`: Compile-time constant, frozen at compilation.
* **Sound Null Safety:** Dart guarantees that variables cannot be null unless explicitly declared as nullable (using the \`?\` modifier).

#### Dart Code Example:
\`\`\`dart
void main() {
  // 1. Static typing & Null safety
  String name = "Alice";
  String? nullableName; // Can be null
  
  // 2. Final vs Const
  final DateTime now = DateTime.now(); // Computed at runtime
  const int maxUsers = 100; // Frozen at compile time
  
  print("Hello, $name. Max users: $maxUsers. Time: $now");
}
\`\`\`

#### Quiz Questions:
1. **Which keyword defines a variable that is a compile-time constant?**
   *   a) final
   *   b) const (Correct)
   *   c) var
2. **What occurs if you attempt to assign null to a variable declared as 'int counter = 0;' in Dart?**
   *   a) It runs successfully
   *   b) The compiler throws a compile-time error due to null safety (Correct)
   *   c) The variable becomes 0

#### Interview Questions:
* **Explain the difference between final and const in Dart.**
  *   *Answer:* Both keywords prevent variables from being reassigned. However, \`final\` is set at runtime (e.g. storing API responses), whereas \`const\` is set at compile time (e.g. constant database margins).
* **What is sound null safety in Dart?**
  *   *Answer:* Sound null safety ensures that variables cannot contain null values unless explicitly declared with a \`?\` mark. It prevents runtime null pointer exceptions, resolving crashes before code runs.

#### Summary:
Dart uses type-inferred static variables. Sound null safety resolves null crashes at compile-time. Use final for runtime locks and const for compile-time constants.
            `,
            exercise: "Write a Dart script that declares a nullable string, checks if it is null, and prints a fallback string using the '??' null-coalescing operator."
          },
          {
            id: "fl-l-1-2",
            title: "Dart Functions, Closures & Lexical Scopes",
            time: "40 min",
            summary: "Named parameters, optional positional parameters, anonymous arrow functions, and closures.",
            content: `
### Dart Functions & Closures

Functions in Dart are first-class objects, meaning they can be passed as arguments to other functions or assigned to variables.

#### Parameter Types:
1. **Required Positional:** standard variables passed in order.
2. **Named Parameters:** Wrapped in \`{ }\`, called by name. Can be marked \`required\` or given default values.
3. **Optional Positional:** Wrapped in \`[ ]\`, called by position index.

#### Dart Code Example:
\`\`\`dart
// Function with named and default parameters
void greetUser({required String username, String role = "Guest"}) {
  print("Welcome $username ($role)");
}

void main() {
  // Invoke function using named arguments
  greetUser(username: "Bob", role: "Admin");
  greetUser(username: "Charlie"); // Uses default Guest role
}
\`\`\`

#### Quiz Questions:
1. **How do you define optional named parameters in a Dart function signature?**
   *   a) Wrap parameters in square brackets \`[ ]\`
   *   b) Wrap parameters in curly braces \`{ }\` (Correct)
   *   c) Prefix parameters with the optional keyword
2. **What represents a first-class function?**
   *   a) A function that cannot return values
   *   b) A function that can be assigned to variables, passed as arguments, and returned from other functions (Correct)
   *   c) A compiled binary function

#### Interview Questions:
* **What is a closure in Dart?**
  *   *Answer:* A closure is a function object that retains access to variables in its lexical scope even when invoked outside its original scope.
* **Explain the difference between named and optional positional parameters.**
  *   *Answer:* Named parameters are wrapped in \`{ }\` and matched by name when calling (e.g., \`func(a: 1)\`). Optional positional parameters are wrapped in \`[ ]\` and matched by position order without writing names.

#### Summary:
Functions support positional, optional positional (\`[ ]\`), and named (\`{ }\`) parameters. First-class function compatibility allows variables to reference function objects.
            `,
            exercise: "Write a Dart function that accepts a list of integers and returns a new list containing only even numbers, using anonymous arrow functions."
          },
          {
            id: "fl-l-1-3",
            title: "Dart Object-Oriented Programming (Classes & Mixins)",
            time: "45 min",
            summary: "Classes, constructors, initialization lists, inheritance, abstract classes, and mixins configurations.",
            content: `
### Object-Oriented Dart

Dart is an object-oriented language supporting classes, single inheritance, interfaces, and mixins.

#### Key OOP Patterns:
* **Constructors & Initializer Lists:** Syntactic sugar to assign fields: \`User(this.name, this.age);\`.
* **Abstract Classes:** Define interfaces with unimplemented methods. Cannot be instantiated.
* **Mixins:** A way to reuse code across multiple class hierarchies without nesting inheritance models. Defined using \`mixin\` and applied using \`with\`.

#### OOP Code Example:
\`\`\`dart
// 1. Define Mixin
mixin Logger {
  void log(String msg) => print("[LOG]: $msg");
}

// 2. Base Class
abstract class Vehicle {
  void drive();
}

// 3. Child Class incorporating Mixin
class Car extends Vehicle with Logger {
  @override
  void drive() {
    log("Car is running.");
  }
}

void main() {
  Car().drive();
}
\`\`\`

#### Quiz Questions:
1. **Which keyword is used to apply a mixin to a Dart class?**
   *   a) extends
   *   b) implements
   *   c) with (Correct)
2. **Can you instantiate an abstract class directly using its default constructor?**
   *   a) Yes
   *   b) No (Correct)
   *   c) Only if it extends another class

#### Interview Questions:
* **What is the difference between implementing an interface and extending a class in Dart?**
  *   *Answer:* Extending (\`extends\`) uses inheritance, inheriting methods and properties from a single parent. Implementing (\`implements\`) treats the target class as an interface, requiring the child class to override every method and property without inheriting implementations.
* **Why would you use a mixin instead of standard inheritance?**
  *   *Answer:* Dart supports only single inheritance. Mixins allow you to inject multiple sets of reusable methods and behaviors into classes without creating deep, complex inheritance trees.

#### Summary:
Dart uses single inheritance. Abstract classes define layouts. Mixins share code laterally across unrelated classes using the \`with\` keyword.
            `,
            exercise: "Create a mixin called Flyable containing a method fly(), and apply it to a Bird class that extends Animal."
          },
          {
            id: "fl-l-1-4",
            title: "Asynchronous Dart: Futures, Streams & Async/Await",
            time: "50 min",
            summary: "Single-thread event loops, Future responses, async/await syntax, and Stream flow subscriptions.",
            content: `
### Asynchronous Dart: Futures & Streams

Dart executes code on a single thread (isolate) using an **Event Loop**. Blocking the thread freezes the user interface. Asynchronous programs offload tasks, returning results later.

#### Futures vs. Streams:
* **Future:** Represents a single asynchronous operation that completes with a value or an error (e.g. fetching an API).
* **Stream:** Represents a sequence of asynchronous events over time (e.g. real-time user location coordinates).

#### Async Code Example:
\`\`\`dart
// Simulating an API call returning a Future
Future<String> fetchUserData() async {
  await Future.delayed(Duration(seconds: 2));
  return "Alice_Data";
}

void main() async {
  print("Fetching data...");
  // Await blocks execution flow locally until future completes
  String user = await fetchUserData();
  print("User returned: $user");
}
\`\`\`

#### Quiz Questions:
1. **What data structure represents a continuous sequence of asynchronous values arriving over time?**
   *   a) Future
   *   b) Stream (Correct)
   *   c) List
2. **What occurs if you omit the await keyword when calling a function that returns a Future?**
   *   a) The script throws a compile error
   *   b) The call returns the Future object immediately rather than the resolved value (Correct)
   *   c) The computer crashes

#### Interview Questions:
* **Explain how Dart executes asynchronous tasks on a single-thread model.**
  *   *Answer:* Dart uses an Event Loop containing a Microtask queue (for short internal events) and an Event queue (for I/O, timers, user inputs). Async tasks are offloaded, and once complete, their callbacks are queued and executed when the main call stack empties.
* **How do you listen to and close a Stream safely?**
  *   *Answer:* Listen using \`stream.listen((data) => { })\` which returns a \`StreamSubscription\`. To prevent memory leaks, you must call \`subscription.cancel()\` inside cleanup methods when the widget is destroyed.

#### Summary:
Async operations run on event loops. Futures handle one-shot events using \`async/await\`. Streams handle sequences of events, requiring subscription cleanups.
            `,
            exercise: "Write a Dart function that generates a Stream yielding numbers 1 to 5 every second, and consume it using await for."
          },
          {
            id: "fl-l-1-5",
            title: "Dart Collections: Lists, Maps & Sets",
            time: "40 min",
            summary: "List iteration, map keys-values alignments, unique Sets, and collection operators (spreads, control flows).",
            content: `
### Dart Collections

Dart offers built-in collections to group and manipulate data structures.

#### Core Collections:
1. **List:** Ordered group of values (index-based, duplicates allowed).
2. **Set:** Unordered collection of unique items.
3. **Map:** Key-value pairs matching unique keys to values.

#### Collection Operators:
* **Spread Operator (\`...\`):** Inserts all elements of a list into another list.
* **Collection If/For:** Allows adding conditional elements directly inside arrays initialization:
  \`\`\`dart
  var nav = ['Home', 'Profile', if (isLoggedIn) 'Settings'];
  \`\`\`

#### Collections Code Example:
\`\`\`dart
void main() {
  // 1. List mapping
  List<int> numbers = [1, 2, 3];
  List<int> doubled = numbers.map((n) => n * 2).toList();
  
  // 2. Set for uniqueness
  Set<String> uniqueIds = {'id-1', 'id-2', 'id-1'}; // Removes duplicates
  print("Unique set length: \${uniqueIds.length}"); // Outputs 2
  
  // 3. Map lookup
  Map<String, String> configs = {'theme': 'dark', 'font': 'sans'};
  print("Active Theme: \${configs['theme']}");
}
\`\`\`

#### Quiz Questions:
1. **Which collection guarantees that all its stored elements are unique?**
   *   a) List
   *   b) Set (Correct)
   *   c) Map
2. **What does the spread operator (...) accomplish in a collection declaration?**
   *   a) It compresses items
   *   b) It inserts all elements of one collection into another collection (Correct)
   *   c) It deletes items

#### Interview Questions:
* **Explain how map() differs from forEach() in Dart collections.**
  *   *Answer:* \`forEach()\` iterates over a collection to perform side effects (e.g. printing values) without returning anything. \`map()\` transforms each element in the collection and returns a new lazy iterable of the transformed values.
* **Why would you use a Set instead of a List?**
  *   *Answer:* Sets guarantee element uniqueness and offer fast lookup times ($\mathcal{O}(1)$) compared to lists ($\mathcal{O}(N)$), making them better for checking memberships or eliminating duplicates.

#### Summary:
Lists store ordered items. Sets store unique elements. Maps link keys to values. Collection operators simplify compiling dynamic lists.
            `,
            exercise: "Write a Dart script that merges two lists using the spread operator, filters out duplicate elements by converting it to a Set, and prints the result."
          }
        ]
      },
      {
        id: "fl-m-2",
        title: "Module 2: Flutter Widgets & Layouts",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Understand the relationship between Widget, Element, and Render trees",
          "Differentiate Stateless vs Stateful Widget lifecycles",
          "Assemble layouts using Rows, Columns, and Flex grids",
          "Implement custom scrolling containers using Slivers",
          "Validate forms and capture input data"
        ],
        lessons: [
          {
            id: "fl-l-2-1",
            title: "Flutter Architecture: Three Trees",
            time: "45 min",
            summary: "Flutter rendering engine, Widget tree, Element tree, RenderObject tree, and repaint updates.",
            content: `
### Flutter Architecture: The Three Trees

Flutter is a cross-platform UI toolkit. It does not compile to native OEM platform components; instead, it draws pixels directly onto a canvas using its own rendering engine (Impeller/Skia).

#### The Three Architecture Trees:
To render layouts efficiently, Flutter maintains three parallel trees:
1. **Widget Tree:** Declarative descriptions of the UI configuration. Widgets are immutable, cheap to create, and destroyed/rebuilt constantly.
2. **Element Tree:** The glue layer managing lifecycle states. It maps widgets to actual render objects, acting as a stable skeleton.
3. **RenderObject Tree:** The layout and painting engine. These objects handle layout sizes, positions, constraints, and painting. They are expensive to create and persist across renders.

#### Quiz Questions:
1. **Which tree in Flutter is immutable and consists of lightweight configuration descriptions rebuilt on every state change?**
   *   a) Element Tree
   *   b) Widget Tree (Correct)
   *   c) RenderObject Tree
2. **What does the Element Tree do?**
   *   a) Plays audio files
   *   b) Links the immutable Widget configurations to the mutable RenderObjects, managing state updates (Correct)
   *   c) Stores styling configs

#### Interview Questions:
* **Why does Flutter maintain three trees instead of just rendering widgets directly?**
  *   *Answer:* For performance optimization. Widgets are rebuilt constantly. If Flutter repainted the entire screen on every widget change, performance would tank. The stable Element tree diffs widget changes, instructing the RenderObject tree to update only modified positions.
* **What is a BuildContext in Flutter?**
  *   *Answer:* A \`BuildContext\` is an Element object representing a widget's position within the Widget tree structure, exposing methods to search for parent providers or theme settings.

#### Summary:
Flutter renders layout canvases directly. Rebuilding immutable widgets triggers element diffing, updating only modified nodes in the RenderObject tree.
            `,
            exercise: "Draw a diagram showing how a simple Row containing two Text widgets maps to its matching Element and RenderObject counterparts."
          },
          {
            id: "fl-l-2-2",
            title: "Stateless vs Stateful Widgets Lifecycle",
            time: "45 min",
            summary: "Stateless lifecycle, Stateful lifecycle stages (initState, didChangeDependencies, build, dispose), and setState updates.",
            content: `
### Stateless vs. Stateful Widgets Lifecycle

Widgets are either stateless (static configurations) or stateful (managing dynamic variables that trigger updates).

#### Stateful Widget Lifecycle Stages:
1. **createState():** Instantiates the mutable State object.
2. **initState():** Runs once when the widget is inserted into the tree. Ideal for initializing variables or listening to streams.
3. **didChangeDependencies():** Runs after initState or when inherited dependencies (like theme context) change.
4. **build():** Runs on initialization, or whenever \`setState()\` is invoked, returning the widget tree layout.
5. **dispose():** Runs when the widget is removed from the tree. Clean up stream subscriptions, timers, and controllers.

#### Code Example:
\`\`\`dart
import 'package:flutter/material.dart';

class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _count = 0;

  @override
  void initState() {
    super.initState();
    // Setup listeners here
  }

  @override
  void dispose() {
    // Cleanup listeners here
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => _count++),
      child: Text("Count: $_count"),
    );
  }
}
\`\`\`

#### Quiz Questions:
1. **Which lifecycle method in a State object runs exactly once at startup, making it ideal for controller initialization?**
   *   a) build
   *   b) initState (Correct)
   *   c) dispose
2. **What occurs when you invoke the setState() function?**
   *   a) The app crashes
   *   b) Flutter marks the widget as dirty and schedules a rebuild of its UI layout tree (Correct)
   *   c) Local database resets

#### Interview Questions:
* **Why must we call super.dispose() at the end of the dispose() method, but super.initState() at the start of the initState() method?**
  *   *Answer:* Initialization must configure parent attributes before child resources are set up. Cleanup must clear child resources first before the parent wraps up, preventing access to deleted memory elements.
* **What is the risk of calling setState() inside the build() method?**
  *   *Answer:* It triggers an infinite recursion loop: \`build()\` calls \`setState()\`, which triggers \`build()\`, crashing the app's thread.

#### Summary:
Stateless widgets are immutable. Stateful widgets manage mutable State objects, cycling through initialization, building, and disposal steps to safely update layouts.
            `,
            exercise: "Build a stateful widget that starts a periodic timer in initState, updates a count variable every second, and halts the timer in dispose."
          },
          {
            id: "fl-l-2-3",
            title: "Layout Widgets: Rows, Columns & Flex Grids",
            time: "45 min",
            summary: "MainAxisAlignment, CrossAxisAlignment, Expanded vs Flexible, and nesting grid layouts.",
            content: `
### Layout Widgets: Rows, Columns & Flex

Flutter builds layouts by nesting layout widgets. The primary structures are Column (vertical stack) and Row (horizontal stack).

#### Axis Alignments:
* **Main Axis:** Vertical for Columns; Horizontal for Rows. Controlled via \`MainAxisAlignment\`.
* **Cross Axis:** Horizontal for Columns; Vertical for Rows. Controlled via \`CrossAxisAlignment\`.

#### Sizing Child Widgets:
* **Expanded:** Forces a child to expand and fill all remaining space along the main axis.
* **Flexible:** Allows a child to size itself to fit its content, but prevents it from exceeding remaining space.
* **Flex Factor:** An integer ratio (flex) determining how remaining space is shared among multiple Expanded elements.

#### Layout Code Example:
\`\`\`dart
Widget build(BuildContext context) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Icon(Icons.star, color: Colors.yellow),
      Expanded(
        child: Container(
          color: Colors.blue,
          child: const Text("Expands to fill all remaining space"),
        ),
      ),
      const Icon(Icons.info),
    ],
  );
}
\`\`\`

#### Quiz Questions:
1. **Which widget forces its child to fill all remaining space along a Row's horizontal axis?**
   *   a) SizedBox
   *   b) Expanded (Correct)
   *   c) Container
2. **Along which axis does MainAxisAlignment align children inside a Column widget?**
   *   a) Horizontal
   *   b) Vertical (Correct)
   *   c) Z-axis

#### Interview Questions:
* **What is an 'unbounded height' layout error, and how do you resolve it?**
  *   *Answer:* It occurs when a scrollable widget (like ListView) is placed inside a Column without height limits. The ListView tries to expand infinitely, causing a layout crash. Resolve it by wrapping the ListView inside an \`Expanded\` widget or setting \`shrinkWrap: true\` and \`physics: ClampingScrollPhysics()\`.
* **Explain how Expanded is related to Flexible.**
  *   *Answer:* \`Expanded\` is a subclass of \`Flexible\` with its fit property preset to \`FlexFit.tight\`. This forces the child to fill all allocated space, whereas \`Flexible\` with \`FlexFit.loose\` allows the child to be smaller than the space.

#### Summary:
Rows and Columns stack children. Use Expanded to fill space and prevent overflow.
            `,
            exercise: "Build a UI layout containing a Row header, followed by a vertical Column, where elements share space in a 2:1 flex ratio."
          },
          {
            id: "fl-l-2-4",
            title: "Custom Scroll Views & Slivers Layouts",
            time: "45 min",
            summary: "ListView constraints, performance limits, CustomScrollView, SliverAppBar, and sliver lists.",
            content: `
### Custom Scroll Views & Slivers

Standard scrollable widgets (like ListView) build their complete list item configurations in memory, which degrades performance for lists with thousands of items. **Slivers** are sliver portions of scrollable areas that render dynamically as they scroll into view.

#### Core Sliver Components:
* **CustomScrollView:** A scroll container that coordinates multiple sliver modules.
* **SliverAppBar:** A flexible header that expands, contracts, or floats on scroll.
* **SliverList:** Renders lists of items dynamically using delegators, replacing ListView.
* **SliverGrid:** Renders grids of items dynamically, replacing GridView.

#### Slivers Code Example:
\`\`\`dart
Widget build(BuildContext context) {
  return CustomScrollView(
    slivers: [
      const SliverAppBar(
        floating: true,
        expandedHeight: 200.0,
        flexibleSpace: FlexibleSpaceBar(title: Text("Collapsing Header")),
      ),
      SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) => ListTile(title: Text("Sliver Row #$index")),
          childCount: 100,
        ),
      ),
    ],
  );
}
\`\`\`

#### Quiz Questions:
1. **Which widget acts as the root container coordinating multiple sliver scroll areas?**
   *   a) ListView
   *   b) CustomScrollView (Correct)
   *   c) SingleChildScrollView
2. **What does a floating SliverAppBar do when the user scrolls back down?**
   *   a) Stays hidden
   *   b) Instantly floats into view at the top of the screen (Correct)
   *   c) Crashes layout views

#### Interview Questions:
* **Why are Slivers highly performant compared to standard scroll views?**
  *   *Answer:* Standard ListViews calculate and build widgets all at once or in large chunks. Slivers interact directly with the scroll viewport, rendering, drawing, and caching only the exact elements currently visible on screen, saving memory.
* **What is a SliverChildBuilderDelegate?**
  *   *Answer:* It is a delegate that constructs children lazily on demand when they scroll into the viewport, supporting infinite list loading.

#### Summary:
Slivers render scroll areas dynamically to optimize memory. CustomScrollView coordinates sliver headers, lists, and grids.
            `,
            exercise: "Write a CustomScrollView layout that places a collapsing SliverAppBar header above a grid list of 20 elements."
          },
          {
            id: "fl-l-2-5",
            title: "User Input: Forms, TextFields & Validations",
            time: "45 min",
            summary: "TextEditingControllers, Form keys, FormState validations, and capture inputs.",
            content: `
### User Input: Forms & Validations

Capturing user input securely requires form controllers, focus managers, and input validations.

#### Key Form Components:
* **Form:** Container managing multiple FormFields (like TextFormFields).
* **GlobalKey<FormState>:** A unique key that references the Form State to trigger validation checks across all child fields.
* **TextEditingController:** An controller object that reads, updates, and monitors text input fields.

#### Form Code Example:
\`\`\`dart
final _formKey = GlobalKey<FormState>();
final _emailController = TextEditingController();

Widget build(BuildContext context) {
  return Form(
    key: _formKey,
    child: Column(
      children: [
        TextFormField(
          controller: _emailController,
          validator: (value) {
            if (value == null || !value.contains('@')) {
              return 'Enter a valid email';
            }
            return null;
          },
        ),
        ElevatedButton(
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              print("Form Validated: \${_emailController.text}");
            }
          },
          child: const Text("Submit"),
        )
      ],
    ),
  );
}
\`\`\`

#### Quiz Questions:
1. **What object references a Form widget to trigger validations across all child fields?**
   *   a) TextEditingController
   *   b) GlobalKey<FormState> (Correct)
   *   c) FocusNode
2. **When should you dispose of a TextEditingController?**
   *   a) In initState
   *   b) In the dispose lifecycle method of a stateful widget to prevent memory leaks (Correct)
   *   c) Never

#### Interview Questions:
* **Why must we dispose of TextEditingControllers?**
  *   *Answer:* Controllers bind to platform focus services and key listeners. If they are not disposed of when widgets unmount, their listeners persist, causing memory leaks.
* **How does TextFormField differ from a standard TextField?**
  *   *Answer:* \`TextField\` is a basic input field. \`TextFormField\` is a specialized wrapper that integrates directly with Form widgets to support validation, errors displays, and form reset triggers.

#### Summary:
Wrap input fields in a Form container, validate inputs using a GlobalKey, and monitor inputs with TextEditingControllers (disposing of them in cleanups).
            `,
            exercise: "Create a Form containing username and password fields. Validate that the password is at least 6 characters long."
          }
        ]
      }
    ]
  },
  {
    id: "fl-phase-2",
        title: "Phase 2: Router Navigation, State Management, APIs, and Packaging (Weeks 3–4)",
        description: "Configure app routing, manage states with Provider/Bloc, call REST endpoints, and build binaries.",
        modules: [
          {
            id: "fl-m-3",
            title: "Module 3: Navigation & State Management",
            duration: "1 Week",
            difficulty: "Advanced",
            objectives: [
              "Navigate using Navigation 1.0 routes and dynamic parameters",
              "Manage state using Provider and ChangeNotifier patterns",
              "Deploy Bloc or Riverpod patterns to segregate business logic",
              "Fetch REST APIs and deserialize JSON payloads",
              "Persist local settings using SharedPreferences and Hive"
            ],
            lessons: [
              {
                id: "fl-l-3-1",
                title: "Navigation 1.0 vs 2.0 Router Systems",
                time: "45 min",
                summary: "Navigator push/pop stacks, named routes, Navigator 2.0 declarative routers, and dynamic arguments.",
                content: `
### Flutter Navigation Systems

Flutter provides navigation models to manage transitions between screens.

#### Navigation Models:
1. **Navigation 1.0 (Imperative):** Maps to a simple stack:
   * \`Navigator.push()\`: Pushes a new screen onto the stack.
   * \`Navigator.pop()\`: Pops the top screen off the stack, returning to the previous screen.
   * Named routes simplify configuration but make dynamic routing arguments complex.
2. **Navigation 2.0 (Declarative):** Uses a router delegate mapping app states directly to page histories, standard for web apps.

#### Navigation 1.0 Code Example:
\`\`\`dart
// Push to Detail Screen passing arguments
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => DetailScreen(userId: 1024),
  ),
);

// Pop screen returning to parent
Navigator.pop(context);
\`\`\`

#### Quiz Questions:
1. **Which command returns the user to the previous screen by removing the top route from the Navigator stack?**
   *   a) Navigator.push
   *   b) Navigator.pop (Correct)
   *   c) Navigator.clear
2. **Why is Navigation 2.0 preferred for web applications?**
   *   a) It supports layouts
   *   b) It binds browser URL changes to the app state, enabling deep linking and back button sync (Correct)
   *   c) It runs faster

#### Interview Questions:
* **How do you return data from a popped screen to its parent in Navigation 1.0?**
  *   *Answer:* \`Navigator.push()\` returns a Future. The parent awaits this future: \`var result = await Navigator.push(...);\`. When the child screen calls pop, it passes the return value: \`Navigator.pop(context, 'Data');\`.
* **What is the role of RouteSettings?**
  *   *Answer:* It carries configuration arguments passed to a route during named routing, allowing target screens to parse parameters.

#### Summary:
Navigation 1.0 uses imperative push/pop stacks. Navigation 2.0 uses declarative state-to-url routers, enabling deep linking.
            `,
            exercise: "Build a Master-Detail page flow where tapping an item on the list page routes to a detail page with matching arguments."
          },
          {
            id: "fl-l-3-2",
            title: "State Management: Provider & ChangeNotifier",
            time: "50 min",
            summary: "InheritedWidget, ChangeNotifier models, Consumer triggers, and optimizing context reads.",
            content: `
### State Management: Provider

As apps grow, passing state down through multiple constructor layers (prop drilling) becomes messy. **Provider** is a wrapper around InheritedWidget that shares state globally across screens.

#### Core Components:
* **ChangeNotifier:** A class that stores variables and notifies listeners using \`notifyListeners()\` when values change.
* **ChangeNotifierProvider:** Places the state object in the widget tree.
* **Consumer:** Listens for updates, rebuilding only its child widgets.
* **context.watch<T>() / context.read<T>():** Read settings:
  * \`watch\`: Triggers rebuilds when state changes.
  * \`read\`: Reads state once without listening for changes (ideal for callbacks).

#### Provider Code Example:
\`\`\`dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// 1. Define State Model
class AuthModel extends ChangeNotifier {
  String? username;

  void login(String name) {
    username = name;
    notifyListeners(); // Rebuilds listening widgets
  }
}

// 2. Consume inside build
Widget build(BuildContext context) {
  final auth = context.watch<AuthModel>();
  return Text(auth.username ?? "Not logged in");
}
\`\`\`

#### Quiz Questions:
1. **What method inside a ChangeNotifier triggers rebuilds in listening widgets?**
   *   a) build()
   *   b) notifyListeners() (Correct)
   *   c) setState()
2. **When should you use context.read<T>() instead of context.watch<T>()?**
   *   a) When drawing lists
   *   b) In button click callbacks where you need to call a function but don't need to rebuild on change (Correct)
   *   c) Inside build() methods

#### Interview Questions:
* **How does Provider prevent unnecessary widget rebuilds?**
  *   *Answer:* By using \`Consumer\` widgets or \`context.read()\`. \`Consumer\` confines rebuild scopes to small widget branches. Using \`context.read()\` inside event callbacks queries the state once without registering a listener, avoiding page-level rebuilds.
* **What is InheritedWidget and how does Provider relate to it?**
  *   *Answer:* \`InheritedWidget\` is a low-level Flutter class that shares data down the widget tree. Writing custom InheritedWidgets requires boilerplate code to handle diff updates; Provider abstracts this, managing lifecycles and rebuild notifications.

#### Summary:
ChangeNotifier models state. ChangeNotifierProvider registers it. Consumer rebuilds only updated elements, preventing redundant renderings.
            `,
            exercise: "Build a cart store using Provider. Implement add/remove methods and display cart item count on a checkout icon."
          },
          {
            id: "fl-l-3-3",
            title: "Advanced State Management: Bloc & Riverpod",
            time: "55 min",
            summary: "Unidirectional data streams, events to states mappings (Bloc), and compile-safe providers in Riverpod.",
            content: `
### Advanced State Management: Bloc & Riverpod

For large enterprise apps, developers use patterns that strictly segregate UI views from business logic.

#### 1. BLoC (Business Logic Component):
A stream-based pattern that separates presentation from logic:
* **Events:** Inputs sent from the UI (e.g. \`TapLoginButton\`).
* **States:** Outputs emitted by the Bloc to rebuild the UI (e.g. \`LoginSuccess\`).
* Blocs map events to states using asynchronous streams, ensuring unidirectional data flow.

#### 2. Riverpod:
A compile-safe, rewrite of Provider that runs independently of the Flutter Widget tree:
* Eliminates runtime \`ProviderNotFoundException\` errors.
* Replaces BuildContext dependencies, allowing state access anywhere in code.

#### Riverpod Code Example:
\`\`\`dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Declare a global state provider
final counterProvider = StateProvider<int>((ref) => 0);

class RiverpodCounter extends ConsumerWidget {
  const RiverpodCounter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch provider value
    final count = ref.watch(counterProvider);
    return ElevatedButton(
      onPressed: () => ref.read(counterProvider.notifier).state++,
      child: Text("Count: $count"),
    );
  }
}
\`\`\`

#### Quiz Questions:
1. **What inputs are sent from the UI to trigger business logic in a BLoC?**
   *   a) States
   *   b) Events (Correct)
   *   c) Themes
2. **Why does Riverpod eliminate ProviderNotFoundException runtime errors?**
   *   a) It runs on native threads
   *   b) Providers are declared as compile-safe global variables independent of the widget tree (Correct)
   *   c) It deletes build contexts

#### Interview Questions:
* **Explain how Bloc's state transition rules improve app predictability.**
  *   *Answer:* Because the UI cannot modify states directly. The UI sends Events. Business logic is handled in the Bloc, emitting immutable States. This unidirectional flow ensures predictable state transitions.
* **What is the difference between ProviderScope and standard providers in Riverpod?**
  *   *Answer:* \`ProviderScope\` is a widget wrapping the root of the app that stores the states of all Riverpod providers.

#### Summary:
BLoC uses event-to-state streams. Riverpod provides compile-safe state providers independent of the widget tree.
            `,
            exercise: "Write a simple CounterBloc mapping 'Increment' and 'Decrement' events to integer state updates."
          },
          {
            id: "fl-l-3-4",
            title: "Fetching REST APIs & JSON Serialization",
            time: "50 min",
            summary: "HTTP requests (GET, POST), connection handling, parsing JSON, and mapping data to Dart objects.",
            content: `
### Fetching APIs & JSON Serialization

Mobile applications interact with backends by querying REST APIs and parsing JSON payloads into typed Dart models.

#### Serialization Pipeline:
1. **Network Query:** Call endpoints asynchronously using packages like \`http\` or \`dio\`.
2. **String Parse:** Parse JSON strings into dynamic maps using \`jsonDecode()\`.
3. **Model Map:** Instantiates typed Dart objects from maps using factory constructors, preventing runtime errors.

#### Serialization Code Example:
\`\`\`dart
import 'dart:convert';
import 'package:http/http.dart' as http;

// 1. Define Typed Model
class User {
  final int id;
  final String name;

  User({required this.id, required this.name});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

// 2. Fetch and deserialize
Future<User> fetchUser() async {
  final response = await http.get(Uri.parse("https://jsonplaceholder.typicode.com/users/1"));
  if (response.statusCode == 200) {
    // Parse dynamic map and map to User object
    return User.fromJson(jsonDecode(response.body));
  } else {
    throw Exception("Failed to load user");
  }
}
\`\`\`

#### Quiz Questions:
1. **Which function converts raw HTTP response body strings into dynamic Dart Map structures?**
   *   a) jsonEncode()
   *   b) jsonDecode() (Correct)
   *   c) toString()
2. **Why is it preferred to map JSON to Dart class models instead of using raw Maps?**
   *   a) Maps do not support dynamic keys
   *   b) Maps lack compile-time type safety, risking runtime crashes from missing keys or incorrect types (Correct)
   *   c) Class models compile faster

#### Interview Questions:
* **How do you handle API errors and timeouts in Flutter?**
  *   *Answer:* Wrap requests in \`try-catch\` blocks to catch network errors. Check status codes (e.g. expecting 200), and use the client's timeout options to throw timeout errors.
* **Explain the difference between jsonEncode() and jsonDecode().**
  *   *Answer:* \`jsonDecode()\` parses a raw JSON string into a Dart Map/List. \`jsonEncode()\` serializes a Dart Map/List back into a JSON string to send in HTTP requests.

#### Summary:
Call endpoints asynchronously. Convert JSON strings to maps with \`jsonDecode()\`, and deserialize them into typed models.
            `,
            exercise: "Call a public user API, parse the JSON array response, and render titles on a ListView.builder UI."
          },
          {
            id: "fl-l-3-5",
            title: "Local Storage: Hive, SharedPreferences & SQLite",
            time: "45 min",
            summary: "Key-value persistent settings, Hive boxes, relational SQLite databases, and migrations management.",
            content: `
### Local Storage in Flutter

Storing user settings, session keys, or caching offline database records requires local storage configurations.

#### Storage Options:
1. **SharedPreferences:** Simple key-value storage for lightweight data (e.g., storing theme selections or login flags). Slow for large datasets.
2. **Hive:** A fast, NoSQL key-value database written in Dart. Stores data in binary boxes. Supports type adapters.
3. **SQLite:** A relational database engine for complex structures, supporting custom indexes and SQL transactions.

#### Hive Storage Code Example:
\`\`\`dart
import 'package:hive/hive.dart';

void manageCache() async {
  // 1. Open a binary data box
  var box = await Hive.openBox('settingsBox');

  // 2. Write key-value pairs
  await box.put('username', 'Alice');

  // 3. Read values
  String? name = box.get('username');
  print("Saved: $name");
}
\`\`\`

#### Quiz Questions:
1. **Which local storage option is a fast NoSQL key-value database written in Dart, saving data in binary boxes?**
   *   a) SharedPreferences
   *   b) Hive (Correct)
   *   c) SQLite
2. **When should you use SQLite instead of SharedPreferences?**
   *   a) To store a boolean theme setting
   *   b) To store and query large relational datasets with tables, indexes, and queries (Correct)
   *   c) Never

#### Interview Questions:
* **Explain how Hive achieves faster performance than SQLite in Flutter.**
  *   *Answer:* SQLite relies on native bridges, translating queries back-and-forth across platforms. Hive is written in pure Dart, caching boxes in memory and saving changes in a binary format directly on disk, bypassing native bridges.
* **What is a TypeAdapter in Hive?**
  *   *Answer:* A \`TypeAdapter\` describes how Hive should serialize and deserialize custom Dart objects (e.g. User models) into binary format for disk storage.

#### Summary:
SharedPreferences handles key-value settings. Hive provides fast NoSQL binary boxes. SQLite manages complex relational tables.
            `,
            exercise: "Initialize a SharedPreferences instance, save an integer counter value, increment it, and load it on boot."
          }
        ]
      },
      {
        id: "fl-m-4",
        title: "Module 4: Platform Integration & Deployment",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Create implicit and explicit animations",
          "Invoke platform Kotlin/Swift APIs using Platform Channels",
          "Build responsive layouts across web, mobile, and tablets",
          "Formulate unit, widget, and integration tests",
          "Generate release app packages for stores"
        ],
        lessons: [
          {
            id: "fl-l-4-1",
            title: "Flutter Animations: Implicit vs Explicit",
            time: "45 min",
            summary: "AnimatedContainer transition properties, AnimationControllers, curves, and tween mappings.",
            content: `
### Flutter Animations: Implicit vs. Explicit

Animations keep application flows feeling natural and premium.

#### Animation Types:
1. **Implicit Animations:** Flutter manages the animation controller. You use widgets like \`AnimatedContainer\` or \`AnimatedOpacity\`. When parameters change, the widget interpolates states automatically.
2. **Explicit Animations:** Developers manage the animation lifecycle manually:
   * **AnimationController:** Controls duration and ticks. Requires a \`vsync\` ticket (TickerProviderStateMixin).
   * **Tween:** Maps input intervals (0.0 to 1.0) to output ranges (e.g. colors or offsets).
   * **AnimatedBuilder:** Listens for ticks and rebuilds only the animating widgets.

#### Implicit Animation Example:
\`\`\`dart
Widget build(BuildContext context) {
  return AnimatedContainer(
    duration: const Duration(milliseconds: 500),
    width: _isExpanded ? 200.0 : 100.0,
    color: _isExpanded ? Colors.blue : Colors.red,
    child: const FlutterLogo(),
  );
}
\`\`\`

#### Quiz Questions:
1. **Which animation type requires managing AnimationControllers and TickerProvider lifecycles manually?**
   *   a) Implicit Animations
   *   b) Explicit Animations (Correct)
   *   c) Dynamic Transitions
2. **What does a Tween define in an animation?**
   *   a) Animation durations
   *   b) The interpolation range between a starting value and an ending value (Correct)
   *   c) Thread frames

#### Interview Questions:
* **What is the purpose of SingleTickerProviderStateMixin vs TickerProviderStateMixin?**
  *   *Answer:* Mixins that generate tickers. Tickers emit ticks on every frame refresh (typically 60-120fps) to drive animations. Use \`SingleTickerProviderStateMixin\` if the widget contains one controller, and \`TickerProviderStateMixin\` for multiple concurrent controllers.
* **How do you optimize animation rebuilds in Flutter?**
  *   *Answer:* Use \`AnimatedBuilder\`. Pass the non-animating child widget to the builder constructor. This registers the child as static, rebuilding only the transform wrapper layer on ticks rather than the child subtree.

#### Summary:
Implicit widgets handle transitions automatically. Explicit animations use Controllers and Tweens to build complex layouts.
            `,
            exercise: "Build an explicit transition that rotates an Image widget 360 degrees repeatedly using an AnimationController."
          },
          {
            id: "fl-l-4-2",
            title: "Platform Channels: Invoking Kotlin/Swift Code",
            time: "50 min",
            summary: "Flutter native compilation, MethodChannel, passing serialized messages, and handling asynchronous platform outputs.",
            content: `
### Platform Channels

Flutter handles rendering directly, but access to native hardware features (like battery state or custom SDKs) requires communicating with the host OS.

#### Platform Channel Architecture:
Flutter uses **Platform Channels** to pass messages between Dart and host platform code (Kotlin/Java on Android, Swift/Objective-C on iOS):
* **MethodChannel:** Used to trigger one-shot API calls (e.g. request battery level).
* **EventChannel:** Used to stream continuous events (e.g. sensor readings).
* Data is automatically serialized into standard types (numbers, maps, strings) during bridge crossings.

#### Method Channel Code Example:
\`\`\`dart
import 'package:flutter/services.dart';

class BatteryInfo {
  // Declare MethodChannel matching a unique namespace key
  static const _channel = MethodChannel('com.example.app/battery');

  Future<int> getBatteryLevel() async {
    try {
      // Invoke native method and wait for response
      final int level = await _channel.invokeMethod('getBatteryLevel');
      return level;
    } on PlatformException catch (e) {
      print("Native Error: \${e.message}");
      return -1;
    }
  }
}
\`\`\`

#### Quiz Questions:
1. **Which channel class is used to invoke one-shot native methods on Android or iOS hosts?**
   *   a) EventChannel
   *   b) MethodChannel (Correct)
   *   c) StreamChannel
2. **How is data sent across platform channels?**
   *   a) By writing to temporary files
   *   b) Automatically serialized into standard type structures (Correct)
   *   c) Using SQL databases

#### Interview Questions:
* **Explain how you would write the native Java/Kotlin code to respond to a MethodChannel call from Dart.**
  *   *Answer:* On the Android side (MainActivity), initialize the MethodChannel with the same namespace. Register a \`MethodCallHandler\` that checks the method name, queries native OS APIs, and calls \`result.success(value)\` or \`result.error()\` to return the data.
* **Why are platform channel operations asynchronous?**
  *   *Answer:* Because native platforms run on their own threads. Querying them across the platform bridge takes time, requiring asynchronous futures to prevent blocking the UI thread.

#### Summary:
Platform channels bridge Dart and native platforms. MethodChannel runs one-shot requests, serializing standard data types across platforms.
            `,
            exercise: "Draft a Dart MethodChannel script invoking a native method named 'getDeviceModel'."
          },
          {
            id: "fl-l-4-3",
            title: "Responsive & Adaptive UI Design",
            time: "45 min",
            summary: "LayoutBuilder constraints, MediaQuery dimensions, and Platform adaptive designs.",
            content: `
### Responsive & Adaptive UI Design

A single Flutter codebase can run on mobile, tablet, desktop, and web.

#### Responsive vs. Adaptive:
* **Responsive:** UI layout adjusts to fit screen sizes (e.g., resizing columns, displaying grid views instead of lists).
* **Adaptive:** UI behaviors adjust to fit the target OS (e.g., displaying Cupertino buttons on iOS and Material buttons on Android).

#### Key Sizing Controls:
* **MediaQuery.of(context).size:** Queries the exact window width and height.
* **LayoutBuilder:** Exposes the parent widget's exact layout constraints (maxWidth, maxHeight), allowing responsive component swaps.

#### Responsive Code Example:
\`\`\`dart
Widget build(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      // If width exceeds tablet threshold, display side-by-side grid
      if (constraints.maxWidth > 600) {
        return GridView.count(crossAxisCount: 3, children: const [Text("Col 1"), Text("Col 2"), Text("Col 3")]);
      } else {
        return ListView(children: const [Text("Row 1"), Text("Row 2")]);
      }
    },
  );
}
\`\`\`

#### Quiz Questions:
1. **What utility query returns the current screen width and height?**
   *   a) LayoutBuilder
   *   b) MediaQuery (Correct)
   *   c) Platform
2. **What does an Adaptive UI design focus on?**
   *   a) Displaying matching components styling conventions depending on the running OS (Correct)
   *   b) Speeding up database queries
   *   c) Shrinking image sizes

#### Interview Questions:
* **How does LayoutBuilder differ from MediaQuery?**
  *   *Answer:* \`MediaQuery\` returns the global dimensions of the entire screen window. \`LayoutBuilder\` returns the specific layout constraints (min/max width and height) allocated by the parent widget, making it better for reusable components.
* **Why should you use Cupertino widgets on iOS?**
  *   *Answer:* To meet App Store design guidelines and user expectations, providing iOS users with native-looking scroll bounces, buttons, and switches.

#### Summary:
Responsive layout swaps rely on LayoutBuilder constraints. Adaptive UIs adapt behaviors to the running platform.
            `,
            exercise: "Build a widget that displays a side menu navigation layout on web/tablet widths (>700px), but uses a BottomNavigationBar on mobile widths."
          },
          {
            id: "fl-l-4-4",
            title: "Testing: Unit, Widget & Integration Tests",
            time: "50 min",
            summary: "Flutter test structures, testing Dart models, testWidgets setups, finding widgets, and integration runs.",
            content: `
### Testing in Flutter

Testing ensures that application code behaves correctly across releases.

#### Testing Categories:
1. **Unit Tests:** Verify individual functions, methods, or models. No UI is loaded.
2. **Widget Tests:** Test component rendering and user interactions in isolation.
3. **Integration Tests:** Test the entire app flow on real devices or simulators.

#### Widget Test Example:
\`\`\`dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/my_button.dart';

void main() {
  testWidgets('Button displays text and triggers tap', (WidgetTester tester) async {
    // 1. Load widget in memory test frame
    await tester.pumpWidget(const MaterialApp(home: MyButton(label: 'Submit')));

    // 2. Locate widget using find
    expect(find.text('Submit'), findsOneWidget);

    // 3. Simulate user tap
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump(); // Triggers frames repaint
  });
}
\`\`\`

#### Quiz Questions:
1. **Which test type is designed to test individual functions or models without UI frames?**
   *   a) Widget Test
   *   b) Unit Test (Correct)
   *   c) Integration Test
2. **What does the tester.pump() command do in a Widget test?**
   *   a) Deletes cache files
   *   b) Schedules a frame repaint, allowing UI changes to render after mock interactions (Correct)
   *   c) Connects to cloud networks

#### Interview Questions:
* **How does testWidgets pump widgets inside testing memory?**
  *   *Answer:* It uses a mock rendering engine. It compiles and runs the widget tree in memory without drawing pixels to an actual screen, allowing fast, headless element assertion testing.
* **What is the difference between find.byType and find.byKey?**
  *   *Answer:* \`find.byType\` searches for widgets by their class definition (e.g. finding all RaisedButtons). \`find.byKey\` locates a specific widget instance using its unique Key, making it robust for target clicks.

#### Summary:
Unit tests evaluate code logic. Widget tests pump elements in memory to test rendering and events. Integration tests run complete paths.
            `,
            exercise: "Write a unit test that verifies a parsePrice() helper function returns correct double values for '$19.99' string inputs."
          },
          {
            id: "fl-l-4-5",
            title: "Flutter App Build Packaging & App Store Release",
            time: "55 min",
            summary: "Android app signing, build outputs (AAB vs APK), iOS signing profiles, Xcode configs, and play/app store publishing.",
            content: `
### Flutter Packaging & Release

Shipping your app requires configuring build profiles and generating release packages for the Google Play Store and Apple App Store.

#### Android Build Process:
* **KeyStore Configuration:** Generate an encrypted cryptographic certificate to sign your release binary.
* **Build Target (Android App Bundle - AAB):**
  * \`flutter build appbundle\`
  * Compiles resources and assets. Google Play uses AAB to generate optimized APKs tailored to each user's device resolution and architecture, shrinking download sizes.

#### iOS Build Process:
* **Apple Developer Account:** Required to configure signing certificates and provisioning profiles.
* **Xcode Configurations:** Run \`flutter build ipa\` to compile, then open Xcode to archive the build and push it to App Store Connect (TestFlight).

#### Quiz Questions:
1. **Which file format is the modern standard for publishing Android applications on the Google Play Store?**
   *   a) APK
   *   b) AAB (Android App Bundle) (Correct)
   *   c) IPA
2. **What Xcode command archives and packages iOS builds for App Store submissions?**
   *   a) flutter build apk
   *   b) Product > Archive (inside Xcode) (Correct)
   *   c) git push

#### Interview Questions:
* **Why has Google Play made AAB files mandatory instead of APK files?**
  *   *Answer:* AAB includes all compiled assets, languages, and architecture libraries. When a user downloads the app, Google Play compiles a customized APK containing only the resources required for that user's specific device, reducing download size by up to 50%.
* **Explain the role of a provisioning profile on iOS.**
  *   *Answer:* A provisioning profile links developer certificates, App IDs, and device list identifiers together, authorizing the iOS device to run the signed application binary.

#### Summary:
Android apps use KeyStores to sign AAB files. iOS apps require Apple Provisioning Profiles and Xcode archiving for App Store Connect distribution.
            `,
            exercise: "Draft a step-by-step checklist of the files and configurations needed to build a release-ready Flutter Android app."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Flutter Development Manuals",
    items: [
      { name: "Flutter Official Documentation", desc: "Detailed references for all standard widgets and styles.", link: "https://docs.flutter.dev" },
      { name: "Dart API Reference Guidelines", desc: "How to compile types, classes, and async code lists.", link: "https://api.dart.dev" },
      { name: "Riverpod Package Portal", desc: "Guides on configuring compile-safe state providers.", link: "https://riverpod.dev" },
      { name: "BLoC Pattern Resource Guide", desc: "How to implement streams mapping events to states.", link: "https://bloclibrary.dev" }
    ]
  }
];

export const glossary = [
  { term: "Sound Null Safety", def: "Dart compile guarantee preventing variable runtime null pointer crashes unless marked nullable." },
  { term: "Mixin", def: "A class definition containing reusable methods that can be injected into multiple class hierarchies." },
  { term: "Element Tree", def: "The stable skeleton tree in Flutter mapping widgets configurations to render objects." },
  { term: "Stateful Widget", def: "A widget managing a mutable State object, scheduling builds on setState() calls." },
  { term: "ChangeNotifier", def: "A class storing variables that notifies listening widgets to rebuild using notifyListeners()." },
  { term: "MethodChannel", def: "A platform bridge invoking one-shot platform API requests on host Android or iOS code." },
  { term: "MediaQuery", def: "A context lookup returning current window dimensions, helping design responsive layouts." },
  { term: "AAB", def: "Android App Bundle - the standard release binary format compiled to optimize downloads sizes." },
  { term: "Widget Test", def: "Test rendering components in memory test frames to assert widgets configurations and gestures." },
  { term: "Riverpod", def: "A compile-safe reactive state sharing library independent of BuildContext trees." }
];

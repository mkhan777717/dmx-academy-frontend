// React Native Dedicated Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "rn-phase-1",
    title: "Phase 1: React Native Core Views, Styles, Lists, and Navigations (Weeks 1–2)",
    description: "Learn React Native thread architecture, Expo CLI, native components (View, Text, TextInput, ScrollView, Pressable), StyleSheets, FlatLists, and stack routers.",
    modules: [
      {
        id: "rn-m-1",
        title: "Module 1: React Native Core Views & Styles",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Explain JS Thread, Native Bridges, and UI Thread operations",
          "Initialize React Native apps using Expo CLI templates",
          "Assemble screens using View, Text, Image, and TextInput components",
          "Design responsive layouts using StyleSheet Flexbox grids",
          "Capture press triggers using Pressable wrappers"
        ],
        lessons: [
          {
            id: "rn-l-1-1",
            title: "React Native Architecture: Threads & Bridges",
            time: "45 min",
            summary: "JS Thread, Native UI Thread, Native Modules Thread, and JSON message bridge serialization.",
            content: `
### React Native Architecture: Threads & Bridges

React Native allows building real mobile apps using JavaScript. It does not run inside a web view; it renders native OEM platform components directly.

#### Thread Architecture:
React Native runs across three core threads:
1. **JS Thread:** Executes Javascript code (React logic, state, API calls, event handlers).
2. **Native UI Thread (Main Thread):** Renders native user interfaces, measures element dimensions, and captures screen gestures.
3. **Native Modules Thread:** Runs background platform-specific tasks (e.g. database transactions).

#### The Bridge (Traditional):
JS and Native threads communicate by passing serialized JSON messages asynchronously across a **Bridge**. In newer versions, the **New Architecture** replaces this bridge with **JSI (JavaScript Interface)**, allowing JavaScript to invoke native C++ methods directly without serialization, eliminating bottlenecks.

#### Quiz Questions:
1. **Which thread compiles and executes the JavaScript code logic in a React Native app?**
   *   a) Native UI Thread
   *   b) JS Thread (Correct)
   *   c) Background Thread
2. **What is JSI (JavaScript Interface) in the React Native New Architecture?**
   *   a) A file compressor
   *   b) A bridge replacement allowing JS to invoke native C++ methods directly with zero serialization (Correct)
   *   c) A styling system

#### Interview Questions:
* **Why are operations across the traditional React Native bridge asynchronous?**
  *   *Answer:* Because the JS thread and the Native thread run on separate process schedules. Synchronous calls would block threads, freezing UI animations if native modules take time to respond.
* **Explain how React Native renders actual native components instead of HTML divs.**
  *   *Answer:* When compiling, React Native matches JS tags (like \`<View>\`) to native platform elements (like \`android.view.ViewGroup\` on Android and \`UIView\` on iOS).

#### Summary:
React Native segregates logic on a JS thread and drawing on a native UI thread. Newer architectures use JSI to query native C++ directly, bypassing traditional bridge serialization lags.
            `,
            exercise: "Summarize the differences between standard web rendering (DOM) and React Native rendering (Native Bridge)."
          },
          {
            id: "rn-l-1-2",
            title: "Expo CLI vs. React Native CLI Setup",
            time: "40 min",
            summary: "Expo client runtime, EAS builds, bare workflows, Xcode/Android Studio configurations.",
            content: `
### Expo CLI vs. React Native CLI

Setting up a React Native workspace requires choosing between the Expo SDK environment and a bare React Native project.

#### Comparison:
1. **Expo CLI (Recommended for most apps):**
   * A managed workflow wrapping native platforms.
   * Runs inside the Expo Go sandbox app on test phones without installing Xcode or Android Studio.
   * EAS (Expo Application Services) builds binaries in the cloud.
   * Simple setup, but custom native libraries require using Config Plugins.
2. **React Native CLI (Bare Workflow):**
   * Direct access to iOS/Android native directories (\`/ios\` and \`/android\`).
   * Requires installing heavy local SDKs (Xcode, Android Studio) to build and run code.
   * Absolute flexibility to write Kotlin/Swift code directly.

#### Quiz Questions:
1. **What tool allows running React Native code on your phone without setting up Xcode or Android Studio locally?**
   *   a) Webpack
   *   b) Expo Go (Correct)
   *   c) Docker Engine
2. **When is React Native CLI preferred over Expo?**
   *   a) For simple form apps
   *   b) When you need custom native code, unique platform libraries, or direct control over /ios and /android folders (Correct)
   *   c) When you want to compile web code

#### Interview Questions:
* **What is the difference between Managed and Bare workflows in Expo?**
  *   *Answer:* In Managed workflows, Expo handles native files dynamically behind the scenes. In Bare workflows (pre-configured with \`npx expo prebuild\`), the native \`/ios\` and \`/android\` folders are exposed, allowing you to edit Xcode/Android Studio settings directly.
* **Explain EAS Build.**
  *   *Answer:* EAS (Expo Application Services) Build is a cloud service that compiles and packages your React Native code into release binaries (AAB or IPA), offloading build resource requirements from your local machine.

#### Summary:
Expo simplifies setups by managing native folders and sandboxing runs. React Native CLI exposes raw native projects immediately, requiring local SDK compiles.
            `,
            exercise: "Initialize an Expo project using npx create-expo-app, inspect its folder structure, and locate the app entry point."
          },
          {
            id: "rn-l-1-3",
            title: "Native View Components: View, Text & Image",
            time: "40 min",
            summary: "Core components, rendering strings, styling text, local/remote image sources, and image caching.",
            content: `
### Core Native Components

React Native does not support standard HTML tags (like \`div\`, \`span\`, or \`img\`). You must use core React Native wrapper components.

#### Core Components:
* **View:** The basic container for layout and styling (equivalent to a \`div\`). Supports Flexbox layout.
* **Text:** The only component that can display text strings. You cannot place raw strings directly inside Views.
* **Image:** Displays static images or dynamic remote assets:
  * Local image: \`source={require('./image.png')}\`
  * Remote URL: \`source={{ uri: 'https://site.com/pic.jpg' }}\` (requires specifying width and height).

#### View Code Example:
\`\`\`jsx
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Card() {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
        style={styles.logo} 
      />
      <Text style={styles.title}>Welcome to React Native</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  logo: { width: 50, height: 50 },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 10 }
});
\`\`\`

#### Quiz Questions:
1. **What occurs if you place a raw text string directly inside a <View> tag without wrapping it in a <Text> component?**
   *   a) It renders with default fonts
   *   b) React Native throws a runtime crash error (Correct)
   *   c) It is hidden
2. **How do you import a local static image file in an Image source attribute?**
   *   a) \`source={{ uri: './pic.png' }}\`
   *   b) \`source={require('./pic.png')}\` (Correct)
   *   c) \`source='./pic.png'\`

#### Interview Questions:
* **Why must you specify width and height for remote network images but not local images?**
  *   *Answer:* Local images are inspected during bundle building, letting React Native read image sizing metadata automatically. Network image dimensions are unknown before downloading; dimensions must be specified to preserve layout sizing.
* **What is the difference between View and SafeAreaView?**
  *   *Answer:* \`SafeAreaView\` automatically applies padding to avoid device notches, status bars, and home indicators, preventing content from being clipped on screens (especially iOS devices).

#### Summary:
Layouts use Views. Strings must reside inside Text tags. Remote images require explicit widths and heights in style properties.
            `,
            exercise: "Build a user profile view containing an avatar Image, a name Text, and a description text box safely enclosed in a SafeAreaView."
          },
          {
            id: "rn-l-1-4",
            title: "Styling: StyleSheet & Flexbox Layouts",
            time: "45 min",
            summary: "StyleSheet API, units without px, flexDirection, justifyContent, alignItems, and styling inheritance limits.",
            content: `
### StyleSheet & Flexbox Layouts

React Native styles layouts using JavaScript objects, implementing a subset of CSS Flexbox.

#### Key Differences from CSS:
1. **No Units (No 'px'):** Sizing is unitless, representing density-independent pixels (dp).
2. **Default Flex Direction:** Flexbox defaults to **Column** (\`flexDirection: 'column'\`) instead of Row.
3. **No Styling Inheritance:** Text styling does not inherit from parent views (e.g. setting color on a View does not color nested Text nodes).
4. **StyleSheet.create():** Optimizes styles by sending them across the native bridge once, caching references.

#### Flexbox Reference Parameters:
* **flexDirection:** \`column\` (default) or \`row\`.
* **justifyContent:** Aligns children along the main axis (\`center\`, \`space-between\`).
* **alignItems:** Aligns children along the cross axis (\`center\`, \`stretch\`).

#### Quiz Questions:
1. **What is the default flexDirection for layouts in React Native?**
   *   a) row
   *   b) column (Correct)
   *   c) grid
2. **Will a Text component inherit color settings from its wrapping parent View style properties?**
   *   a) Yes
   *   b) No (Correct)
   *   c) Only on iOS

#### Interview Questions:
* **What are density-independent pixels (dp), and how do they ensure responsive layouts?**
  *   *Answer:* Density-independent pixels scale automatically based on physical screen resolution, ensuring elements render at similar physical sizes across different device screens.
* **Why should you use StyleSheet.create() instead of inline styling objects?**
  *   *Answer:* Inline styling objects are recreated on every render cycle, triggering new bridges memory copies. \`StyleSheet.create()\` compiles styles into unique integer IDs, sending them across the bridge once to optimize performance.

#### Summary:
React Native defaults Flexbox to Column. Styles are unitless, and text does not inherit colors. Use StyleSheet.create to cache styles.
            `,
            exercise: "Build a horizontal toolbar container using Flexbox, spacing three buttons evenly across the screen."
          },
          {
            id: "rn-l-1-5",
            title: "Handling User Inputs: TextInput & Pressable",
            time: "45 min",
            summary: "TextInput callbacks, keyboardType configurations, secureTextEntry, TouchableOpacity vs Pressable wrappers, and HitSlop buffers.",
            content: `
### TextInput & Pressable Wrappers

Capturing inputs in mobile apps requires configuring keyboard types, secure entries, and touch gestures.

#### 1. Input Fields (TextInput):
* **keyboardType:** Standardizes layouts (e.g. \`numeric\`, \`email-address\`).
* **secureTextEntry:** Obfuscates text input (standard for passwords).

#### 2. Touch Wrappers (Pressable vs Touchable):
* **TouchableOpacity:** Legacy wrapper that dimisses child opacity on press.
* **Pressable:** Modern, highly customizable touch wrapper supporting detailed state tracking (e.g., pressed states, hover states) and hitSlop (extending touch targets without changing sizes).

#### Code Example:
\`\`\`jsx
import { useState } from 'react';
import { TextInput, Pressable, Text, StyleSheet } from 'react-native';

export default function Form() {
  const [pass, setPass] = useState("");

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(text) => setPass(text)}
      />
      <Pressable 
        style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        onPress={() => print("Submit Form")}
      >
        <Text style={styles.btnText}>Submit</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  input: { height: 40, borderWidth: 1, padding: 10 },
  btn: { padding: 12, backgroundColor: 'blue', alignItems: 'center' },
  btnPressed: { opacity: 0.7 }
});
\`\`\`

#### Quiz Questions:
1. **Which TextInput prop obfuscates text inputs for password entry?**
   *   a) keyboardType="password"
   *   b) secureTextEntry={true} (Correct)
   *   c) hidden={true}
2. **What does the hitSlop prop do on a Pressable component?**
   *   a) Speeds up keyboard loading
   *   b) Increases the interactive touch target area of a component without changing its physical screen size (Correct)
   *   c) Animates inputs

#### Interview Questions:
* **Why is Pressable preferred over TouchableOpacity in modern React Native?**
  *   *Answer:* \`Pressable\` offers a cleaner API that hooks into touch state lifecycles directly, exposing callbacks for hover, focus, and long-presses, which makes styling complex states easier.
* **How does onChangeText differ from onChange in TextInput?**
  *   *Answer:* \`onChange\` returns a native event object containing target attributes. \`onChangeText\` directly returns the changed text string, simplifying state updates.

#### Summary:
Configure keyboard layouts on TextInput fields. Use Pressable with states and hitSlops to configure touch targets.
            `,
            exercise: "Build an input form containing email and password inputs, with validation checks mapping input errors."
          }
        ]
      },
      {
        id: "rn-m-2",
        title: "Module 2: Lists & Navigation",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Deploy high-performance FlatList and SectionList containers",
          "Configure React Navigation stacks and bottom-tab navigation",
          "Pass parameters across screens and configure deep links",
          "Persist local states using AsyncStorage"
        ],
        lessons: [
          {
            id: "rn-l-2-1",
            title: "FlatList & SectionList: Performance Lists",
            time: "45 min",
            summary: "ListView performance limitations, FlatList lazily rendering, keyExtractor, renderItem, and SectionList headers.",
            content: `
### High-Performance Lists: FlatList

Standard scroll containers (like ScrollView) render all items at once. For lists with thousands of items, this exhausts system memory and crashes apps. **FlatList** and **SectionList** resolve this by rendering items lazily as they scroll into view.

#### Key FlatList Props:
* **data:** The array of items to render.
* **renderItem:** Callback function returning the JSX template for each item.
* **keyExtractor:** Returns a unique key string for each item.
* **getItemLayout:** Optional optimization that pre-calculates element dimensions, skipping dynamic measurement steps.

#### FlatList Code Example:
\`\`\`jsx
import { FlatList, Text, View } from 'react-native';

const items = Array.from({ length: 1000 }, (_, i) => ({ id: \`\${i}\`, text: \`Row #\${i}\` }));

export default function List() {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 20, borderBottomWidth: 1 }}><Text>{item.text}</Text></View>
      )}
    />
  );
}
\`\`\`

#### Quiz Questions:
1. **Why is ScrollView bad for rendering list structures with thousands of rows?**
   *   a) It does not support scroll gestures
   *   b) It renders all items in memory at once, consuming massive RAM and causing lag (Correct)
   *   c) It limits font weights
2. **What does SectionList do?**
   *   a) Sorts data alphabetically
   *   b) Renders list items grouped under labeled section headers (Correct)
   *   c) Compresses local images

#### Interview Questions:
* **How does FlatList optimize memory under the hood?**
  *   *Answer:* It maintains a virtual window. It instantiates and renders only the items currently visible on screen (plus a small buffer), recycling unmounted rows as they scroll out of view.
* **Why should you implement getItemLayout in a FlatList?**
  *   *Answer:* By default, FlatList measures item dimensions dynamically during scroll. \`getItemLayout\` pre-calculates item heights and offsets, skipping dynamic measurements and improving scroll performance for long lists.

#### Summary:
Use FlatList to render long lists efficiently. Define data arrays, renderItem templates, and unique keys, adding getItemLayout for performance.
            `,
            exercise: "Build a SectionList that groups food menu items under 'Appetizers' and 'Main Course' headers."
          },
          {
            id: "rn-l-2-2",
            title: "React Navigation: Stacks & Tabs",
            time: "50 min",
            summary: "React Navigation container, stack navigators, push/pop routes, bottom tab bars, and nested router structures.",
            content: `
### React Navigation: Stacks & Tabs

Mobile routing manages transitions using stack histories and tab interfaces, coordinated by the **React Navigation** package.

#### Router Types:
1. **Stack Navigator:** Manages card transitions, pushing new screens onto the stack and popping them off when navigating back.
2. **Tab Navigator (Bottom Tabs):** Renders a bottom tab bar to swap main screen layouts.

#### Stack Code Example:
\`\`\`jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
\`\`\`

#### Quiz Questions:
1. **Which navigation component wraps the entire routing system inside a React Native application?**
   *   a) Stack.Screen
   *   b) NavigationContainer (Correct)
   *   c) Tab.Navigator
2. **How do you navigate programmatically to a screen named 'Details' in a stack?**
   *   a) navigation.push("Details") (or navigation.navigate("Details")) (Correct)
   *   b) router.go("Details")
   *   c) window.location = "/details"

#### Interview Questions:
* **How do you pass arguments to a screen during navigation in React Navigation?**
  *   *Answer:* Pass parameters as a second argument to the navigate call: \`navigation.navigate('Details', { itemId: 42 })\`. Read parameters on the target screen using the \`route.params.itemId\` attribute.
* **Explain how to nest a Stack Navigator inside a Tab Navigator.**
  *   *Answer:* Create the Tab Navigator as the root. Set one of the Tab Screens to reference a component that renders a Stack Navigator, allowing stack navigation within that tab slot.

#### Summary:
React Navigation uses Stacks for drill-down views and Tabs for main screen swaps. Wrap the system in a NavigationContainer.
            `,
            exercise: "Build a router configuration with a Home screen, containing a button routing to a Details screen with arguments."
          }
        ]
      }
    ]
  },
  {
    id: "rn-phase-2",
    title: "Phase 2: Hardware API Integration, Gestures, and Deployments (Weeks 3–4)",
    description: "Access local device cameras, maps, location coordinates, platform styles, pan gestures, and build app packages.",
    modules: [
      {
        id: "rn-m-3",
        title: "Module 3: Device Features & Local Storage",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Query network endpoints and manage AsyncStorage state caches",
          "Access device camera APIs and pick gallery photos",
          "Query location coordinates and draw maps",
          "Apply platform-specific configurations using the Platform API"
        ],
        lessons: [
          {
            id: "rn-l-3-1",
            title: "AsyncStorage: Local Key-Value Persistence",
            time: "45 min",
            summary: "Stateless devices caches, AsyncStorage limits, storing objects, and error checking.",
            content: `
### AsyncStorage: Local Key-Value Persistence

Storing credentials, local tokens, or user preferences requires persistent key-value storage.

#### AsyncStorage API:
An asynchronous, persistent key-value storage system.
* **String Constraint:** AsyncStorage stores only string data. To store objects or arrays, serialize them to JSON first using \`JSON.stringify()\`, and deserialize them using \`JSON.parse()\` on retrieval.
* **Non-relational:** Not suited for complex queries; use SQLite for relational databases.

#### AsyncStorage Example:
\`\`\`javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Write value
async function saveToken(token) {
  try {
    await AsyncStorage.setItem('user_token', token);
  } catch (error) {
    console.error("Write error:", error);
  }
}

// 2. Read value
async function getToken() {
  try {
    const value = await AsyncStorage.getItem('user_token');
    return value;
  } catch (error) {
    return null;
  }
}
\`\`\`

#### Quiz Questions:
1. **Can AsyncStorage store JavaScript objects directly without serialization?**
   *   a) Yes
   *   b) No, it only stores strings, requiring JSON.stringify() serialization (Correct)
   *   c) Only on Android
2. **What occurs when you update an AsyncStorage key that does not exist?**
   *   a) The call throws a write error
   *   b) It inserts the key-value pair as a new entry (Correct)
   *   c) The app resets

#### Interview Questions:
* **How does AsyncStorage persist data on Android versus iOS?**
  *   *Answer:* On iOS, it saves data in small dictionary files or inside a local SQLite database. On Android, it uses a SQLite database or RocksDB local files.
* **Why should you avoid using AsyncStorage for large data caches?**
  *   *Answer:* It has slow serialization speeds and lack indexes. For large datasets, use binary NoSQL stores (like Hive) or relational databases (like SQLite).

#### Summary:
AsyncStorage stores persistent strings. Serialize objects to JSON before writing, and deserialize them on read.
            `,
            exercise: "Write helpers to save, load, and delete a user profile object in AsyncStorage."
          },
          {
            id: "rn-l-3-2",
            title: "Camera & Gallery API Access",
            time: "50 min",
            summary: "Platform permissions, expo-image-picker configurations, capturing photos, and displaying assets.",
            content: `
### Camera & Gallery API Access

Accessing camera hardware or photo libraries requires request permissions from the user.

#### Implementation with Expo:
We use the \`expo-image-picker\` package to abstract platform differences:
1. **Request Permissions:** Call \`requestCameraPermissionsAsync()\` or \`requestMediaLibraryPermissionsAsync()\`.
2. **Launch Interface:** Trigger camera capture or image selection:
   * \`launchCameraAsync()\`: Opens the native camera app.
   * \`launchImageLibraryAsync()\`: Opens the gallery.
3. **Display Asset:** Use the image URI to render it in an \`<Image>\` widget.

#### Camera Access Code Example:
\`\`\`javascript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Button } from 'react-native';

export default function PhotoSelector() {
  const [photoUri, setPhotoUri] = useState(null);

  const selectPhoto = async () => {
    // 1. Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    // 2. Launch gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <>
      <Button title="Select Photo" onPress={selectPhoto} />
      {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}
    </>
  );
}
\`\`\`

#### Quiz Questions:
1. **What must you call before invoking device camera hardware or gallery selections?**
   *   a) A database query
   *   b) A request permission API call (Correct)
   *   c) App restart
2. **How does expo-image-picker reference selected photos?**
   *   a) By sending binary code
   *   b) By returning a local system URI path to the file (Correct)
   *   c) By saving them to AsyncStorage

#### Interview Questions:
* **How do you handle permission rejection states in mobile apps?**
  *   *Answer:* By checking the permission status before launching hardware APIs. If permission is denied, disable photo features and display a prompt instructing the user to enable permissions in their device settings.
* **Explain why we configure image quality parameters in picker calls.**
  *   *Answer:* Sizing profiles can create bloated image files. Restricting quality (e.g. \`quality: 0.5\`) compresses photos, reducing memory usage and backend upload times.

#### Summary:
Request permissions before accessing hardware. Use \`expo-image-picker\` to capture or select images, rendering files using local URI references.
            `,
            exercise: "Build a profile page that allows users to snap a photo and displays it inside a circular avatar container."
          },
          {
            id: "rn-l-3-3",
            title: "GPS Location & Maps Integration",
            time: "50 min",
            summary: "Location tracking permissions, expo-location integrations, fetching coordinates, and react-native-maps layouts.",
            content: `
### GPS Location & Maps Integration

Displaying maps and capturing coordinates requires permissions and maps libraries.

#### Implementation:
* **Coordinates Query (expo-location):**
  1. Request location permissions: \`requestForegroundPermissionsAsync()\`.
  2. Query coordinates: \`getCurrentPositionAsync()\`.
* **Map Display (react-native-maps):**
  * Use the \`<MapView>\` component, specifying a \`region\` containing latitude, longitude, and zoom parameters (\`latitudeDelta\`, \`longitudeDelta\`).
  * Render markers inside the map: \`<Marker coordinate={...} />\`.

#### Maps Code Example:
\`\`\`jsx
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} title="My Pin" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});
\`\`\`

#### Quiz Questions:
1. **Which package is the standard choice to display interactive maps in React Native applications?**
   *   a) expo-location
   *   b) react-native-maps (Correct)
   *   c) react-native-images
2. **What coordinates attributes define the zoom level of a MapView region?**
   *   a) latitude and longitude
   *   b) latitudeDelta and longitudeDelta (Correct)
   *   c) width and height

#### Interview Questions:
* **What is the difference between foreground and background location permissions?**
  *   *Answer:* Foreground permission allows accessing location only while the app is open and visible. Background permission allows querying location in the background when the app is minimized, which is subject to stricter app store reviews.
* **Explain how latitudeDelta dictates the map zoom level.**
  *   *Answer:* It defines the degrees of latitude shown on screen. A smaller delta (e.g. 0.01) zooms in, displaying a smaller area in detail. A larger delta zooms out.

#### Summary:
Request foreground location permissions, query coordinates, and pass them to \`MapView\` and \`Marker\` to display interactive maps.
            `,
            exercise: "Write an async function querying the user's current location, updating a map region state variable."
          },
          {
            id: "rn-l-3-4",
            title: "Platform-Specific Styles & Platform API",
            time: "45 min",
            summary: "Platform module checks, Platform.select style switches, and platform-specific file extensions (.ios.js, .android.js).",
            content: `
### Platform-Specific Styles & Files

A key benefit of React Native is code reuse. However, styling and layout behaviors must occasionally adapt to comply with platform-specific design guidelines.

#### Platform Suffix Files:
React Native automatically detects platform-specific file extensions during compilation:
* \`UserButton.ios.js\`: Compiled only on iOS.
* \`UserButton.android.js\`: Compiled only on Android.
In code, import them normally: \`import UserButton from './UserButton';\`.

#### Platform Module:
* **Platform.OS:** String check returning \`'ios'\` or \`'android'\`.
* **Platform.select():** Matches style parameters dynamically based on the platform:
  \`\`\`javascript
  const styles = StyleSheet.create({
    container: {
      marginTop: Platform.OS === 'ios' ? 20 : 0,
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOpacity: 0.2 },
        android: { elevation: 4 }
      })
    }
  });
  \`\`\`

#### Quiz Questions:
1. **Which Platform.select configuration style key applies shadow configurations on Android?**
   *   a) shadowColor
   *   b) elevation (Correct)
   *   c) shadowOpacity
2. **If you import an element from './Card', and Card.ios.js and Card.android.js exist, what does React Native compile on iOS?**
   *   a) Card.android.js
   *   b) Card.ios.js (Correct)
   *   c) Both

#### Interview Questions:
* **How do you apply safe padding on Android status bars since SafeAreaView only supports iOS automatically?**
  *   *Answer:* By reading the status bar height using the \`StatusBar.currentHeight\` API and applying it as top padding on Android devices using a Platform check.
* **Why would you write platform-specific files (.ios.js, .android.js) instead of using Platform.select?**
  *   *Answer:* Use \`Platform.select\` for minor style overrides. Use platform-specific files when components require completely different layouts, logic, or native library dependencies.

#### Summary:
Use the \`Platform\` module to customize styles dynamically. Use platform-specific file extensions (\`.ios.js\`, \`.android.js\`) to split complex components.
            `,
            exercise: "Build a container that uses a shadow offset on iOS and an elevation of 5 on Android."
          }
        ]
      },
      {
        id: "rn-m-4",
        title: "Module 4: Packaging & Deployments",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Deploy smooth animations using React Native Reanimated",
          "Apply EAS build configurations to compile binaries",
          "Publish release binaries to Google Play and Apple App Store"
        ],
        lessons: [
          {
            id: "rn-l-4-1",
            title: "React Native Reanimated: Smooth Animations",
            time: "45 min",
            summary: "Layout animations, shared values, useSharedValue, useAnimatedStyle, and running animations on the UI thread.",
            content: `
### Smooth Animations: React Native Reanimated

Smooth UI animations at 60fps are crucial for mobile apps. Standard animations run on the JS thread, causing stutter if the thread is busy. **Reanimated** runs animations directly on the **Native UI Thread** using Worklets.

#### Core Concepts:
* **Shared Values (useSharedValue):** Mutable reference parameters that drive animations on the native side: \`const opacity = useSharedValue(0);\`.
* **Animated Styles (useAnimatedStyle):** Maps shared values to style parameters:
  \`\`\`javascript
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));
  \`\`\`
* **Animated Components:** Only components wrapped by Reanimated can use animated styles (e.g. \`Animated.View\`).

#### Reanimated Code Example:
\`\`\`jsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Button, View } from 'react-native';

export default function FadeWidget() {
  const width = useSharedValue(100);

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(width.value),
  }));

  return (
    <View>
      <Animated.View style={[{ height: 100, backgroundColor: 'blue' }, animatedStyle]} />
      <Button title="Expand" onPress={() => width.value += 50} />
    </View>
  );
}
\`\`\`

#### Quiz Questions:
1. **Why does React Native Reanimated run animations smoother than standard style transitions?**
   *   a) It runs animations directly on the Native UI thread using Worklets, preventing JS thread bottlenecks (Correct)
   *   b) It reduces layout dimensions
   *   c) It runs on web caches
2. **What hook declares mutable animatable reference values in Reanimated?**
   *   a) useState
   *   b) useSharedValue (Correct)
   *   c) useAnimatedStyle

#### Interview Questions:
* **What is a Worklet in Reanimated?**
  *   *Answer:* A small JavaScript function compiled to execute directly on the Native UI thread's JavaScript context, enabling smooth frame updates.
* **Explain how withSpring differs from withTiming.**
  *   *Answer:* \`withTiming\` animates values linearly or via cubic-bezier curves over a set duration. \`withSpring\` uses physics-based spring simulations (damping, stiffness), producing bounce effects without duration limits.

#### Summary:
Reanimated runs animations on the UI thread. Declare variables using \`useSharedValue\`, map them to styles with \`useAnimatedStyle\`, and apply animations using \`withSpring\`.
            `,
            exercise: "Build a fade-in widget that animates opacity from 0 to 1 on mount using withTiming."
          },
          {
            id: "rn-l-4-2",
            title: "Expo EAS Build: Compiling Binaries",
            time: "50 min",
            summary: "EAS CLI installations, eas.json configurations, profile definitions, and cloud build runs.",
            content: `
### EAS Build: Compiling Binaries

Publishing apps requires compiling and packaging code into production-ready binaries.

#### EAS Build Pipeline:
EAS Build compiles binary packages in the cloud:
1. **Install EAS CLI:** \`npm install -g eas-cli\`
2. **Login:** Authenticate with Expo: \`eas login\`
3. **Configure (eas.json):** Set build profiles (development, preview, production):
   \`\`\`json
   {
     "build": {
       "production": {
         "android": { "buildType": "appbundle" },
         "ios": { "simulator": false }
       }
     }
   }
   \`\`\`
4. **Trigger Build:** Run the command to queue cloud builds:
   * Android App Bundle (AAB): \`eas build --platform android\`
   * iOS App Archive (IPA): \`eas build --platform ios\`

#### Quiz Questions:
1. **What command triggers a cloud build for Android devices using the EAS CLI?**
   *   a) eas build --platform android (Correct)
   *   b) npm run build
   *   c) expo start
2. **Where are build profiles (e.g. preview, production) configured in an Expo project?**
   *   a) app.json
   *   b) eas.json (Correct)
   *   c) package.json

#### Interview Questions:
* **What is the difference between an APK and an AAB build for Android?**
  *   *Answer:* APK is a standalone installer file that users download to install apps directly. AAB is a publishing format containing all compiled resources. Google Play uses AAB to generate optimized APKs tailored to each user's device.
* **Why does EAS build require configuring credentials?**
  *   *Answer:* To sign release binaries. EAS generates and stores keystores (Android) and provisioning profiles/certificates (iOS) securely on Expo's servers, verifying that the binary is compiled by the authorized developer.

#### Summary:
EAS CLI builds release packages (AAB/IPA) in the cloud based on profiles configured in \`eas.json\`, managing signing credentials automatically.
            `,
            exercise: "Draft an eas.json configuration file defining 'development' and 'production' build profiles."
          },
          {
            id: "rn-l-4-3",
            title: "App Store & Play Store Submissions",
            time: "55 min",
            summary: "Google Play Console, Apple App Store Connect, EAS Submit configurations, store credentials, and review cycles.",
            content: `
### App Store & Play Store Submissions

The final step is submitting your compiled AAB and IPA binaries to the Google Play Store and Apple App Store for review.

#### Store Accounts Setup:
* **Google Play Console:** Requires a one-time developer registration fee. You submit AAB binaries, configure store listings, and manage rollouts.
* **Apple App Store Connect:** Requires an annual developer fee. You configure provisioning profiles, upload IPA binaries, and submit builds for review.

#### EAS Submit Automation:
You can automate submissions using the EAS CLI:
\`\`\`bash
# Submit compiled binary directly to the stores
eas submit --platform all
\`\`\`
The command pulls credentials and pushes the latest cloud builds directly to Google Play console tracks and Apple TestFlight.

#### Quiz Questions:
1. **What CLI command pushes compiled EAS cloud builds directly to App Store and Google Play console tracks?**
   *   a) eas submit --platform all (Correct)
   *   b) git push production
   *   c) eas build
2. **What iOS tool is standard for distributing beta builds to testers before submitting for App Store review?**
   *   a) Google Play Console
   *   b) TestFlight (Correct)
   *   c) Expo Go

#### Interview Questions:
* **Describe the app review cycle and common rejection reasons.**
  *   *Answer:* App reviews take 1 to 5 days. Common rejection reasons include crashes, requesting excessive permissions without explanation, violating design guidelines, or missing privacy policy links.
* **How do you manage app updates after release?**
  *   *Answer:* For minor JS changes, use OTA (Over-The-Air) updates using Expo Updates. For major updates that change native code, libraries, or app permissions, you must rebuild the binaries (AAB/IPA) and submit them for store review.

#### Summary:
Submit signed binaries (AAB/IPA) to stores. Automate submissions using \`eas submit\`, and use TestFlight to run beta tests before final review.
            `,
            exercise: "Compile a checklist of assets and metadata (metadata description, screenshots, policies) needed for store listings."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "React Native Manuals",
    items: [
      { name: "React Native Core Documentation", desc: "Detailed guides for StyleSheet layout parameters and Views.", link: "https://reactnative.dev/docs/getting-started" },
      { name: "Expo SDK Guide Documentation", desc: "EAS build pipelines, camera permissions, and image pickers.", link: "https://docs.expo.dev" },
      { name: "React Navigation API Reference", desc: "How to configure stack, tab, and drawer navigators.", link: "https://reactnavigation.org" },
      { name: "React Native Reanimated Manual", desc: "Creating native-thread animations and shared values.", link: "https://docs.swmansion.com/react-native-reanimated" }
    ]
  }
];

export const glossary = [
  { term: "Native Bridge", def: "Asynchronous JSON channel translating messages between the JS thread and native UI thread." },
  { term: "Sound Null Safety", def: "Dart compile guarantee preventing variable runtime null pointer crashes unless marked nullable." },
  { term: "Expo Go", def: "A sandbox application allowing developers to test React Native code on devices without local compiling." },
  { term: "FlatList", def: "High-performance scrolling list rendering rows lazily to optimize memory usage." },
  { term: "AsyncStorage", def: "Asynchronous persistent key-value local storage storing data as strings." },
  { term: "MethodChannel", def: "A platform bridge invoking platform APIs on native host Java or Swift code." },
  { term: "Platform API", def: "Built-in utility querying running OS strings and mapping styles per platform." },
  { term: "Reanimated", def: "Animation library running transitions on the native UI thread using C++ Worklets." },
  { term: "EAS Build", def: "Cloud service compiling React Native code into signed release binaries." },
  { term: "TestFlight", def: "Apple's beta testing distribution network hosting pre-release builds." }
];

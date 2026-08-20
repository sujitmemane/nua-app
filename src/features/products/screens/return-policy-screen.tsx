import { Stack } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { Skeleton } from '@/components/skeleton';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { RETURN_POLICY_URL } from '../constants';




const EXAMPLE_DOMAIN = 'https://example.com';




// Must live outside the screen. If you define this inside ReturnPolicyScreen,
// it is a new component type every render and memo cannot skip.
const ListItem = memo(function ListItem({
  item,
  onRemove,
}: {
  item: number;
  onRemove: (item: number) => void;
}) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <Pressable onPress={() => onRemove(item)} style={styles.listItemChip}>
      <Text style={styles.listItem}>{item}</Text>
      <Text style={styles.renderCount}>r{renders.current}</Text>
    </Pressable>
  );
});

export function ReturnPolicyScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const webviewRef = useRef<WebView>(null);
  const [counter, setCounter] = useState(0);

  // Recalc only when `list` changes — not on every counter tick.
  const stats = useMemo(() => {
    return {
      sum: list.reduce((total, n) => total + n, 0),
      evens: list.filter((n) => n % 2 === 0).length,
    };
  }, [list]);

  // Stable fn identity. Without this, memo(ListItem) re-renders every second
  // because onRemove would be a new function on each parent render.
  const handleRemove = useCallback((item: number) => {
    setList((prev) => prev.filter((n) => n !== item));
  }, []);

  const handleAdd = useCallback(() => {
    setList((prev) => [...prev, (prev[prev.length - 1] ?? 0) + 1]);
  }, []);

  const handleResetList = useCallback(() => {
    setList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }, []);

  function handleLoaded() {
    setIsLoading(false);
  }

  const handleMessage = (event: WebViewMessageEvent) => {
    webviewRef.current?.injectJavaScript(`
      alert('Message from webview: ${event.nativeEvent.data}');
    `);
  };


useEffect(()=>
  {
    const timer = setInterval(()=>{
      setCounter(prev => prev + 1);
    },1000);
    return () => clearInterval(timer);
  },[])

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Return Policy' }} />
      <Text style={styles.counterText}>{counter}</Text>
      <Text style={styles.statsText}>
        sum {stats.sum} · evens {stats.evens}
      </Text>
      <View style={styles.listActions}>
        <Button title="Add item" onPress={handleAdd} />
        <Button title="Reset list" onPress={handleResetList} />
      </View>
      <View style={styles.listContainer}>
        {list.map((item) => (
          <ListItem key={item} item={item} onRemove={handleRemove} />
        ))}
      </View>

      {Platform.OS === 'web' ? (
        <iframe
          src={RETURN_POLICY_URL}
          style={styles.iframe}
          title="Return Policy"
          onLoad={handleLoaded}
        />
      ) : (
        <WebView
            ref={webviewRef}
            // source={{ uri: EXAMPLE_DOMAIN }}
            source={{
              html: `
              <!DOCTYPE html>
              <html>
                <body>
                  <h1>Hello Web</h1>
          
                  <button onclick="sendmessage()" width="500px" height="500px" style="background-color: red; color: white; font-size: 20px; border-radius: 10px; padding: 10px; margin: 10px; cursor: pointer;">
                    Send Message
                  </button>
                </body>
                <script>
                  function sendmessage() {
                    window.ReactNativeWebView.postMessage('Hello World from webview');
                  }
                </script>
              </html>
            `,
          }}
          onMessage={handleMessage}
            style={styles.webview}
          onLoadEnd={handleLoaded}
          onError={handleLoaded}
        />
      )}

<Button
  title="Make website red"
  onPress={() => {
    webviewRef.current?.injectJavaScript(`
      document.body.style.backgroundColor = 'red';
      true;
    `);
  }}
/>

<Button title="Increase font size" onPress={() => {
  webviewRef.current?.injectJavaScript(`
    document.body.style.fontSize = '90px';
    true;
  `);
}} />


<Button title="Reset" onPress={() => {  
  webviewRef.current?.injectJavaScript(`
    document.body.style.backgroundColor = 'white';
    document.body.style.fontSize = '16px';
    true;
  `); 
}} />

<Button title="Chanage the conten of webview " onPress={()=>{
  webviewRef.current?.injectJavaScript(`
    document.body.innerHTML = '<h1>Hello World</h1>';
    true;
  `);
}} />

      {isLoading ? <ReturnPolicySkeleton /> : <></>}
    </View>
  );
}

function ReturnPolicySkeleton() {
  return (
    <ThemedView style={styles.skeleton}>
      <Skeleton style={styles.hero} />
      <Skeleton style={styles.title} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.lineShort} />
      <Skeleton style={styles.block} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.line} />
      <Skeleton style={styles.lineShort} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  iframe: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  skeleton: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  hero: {
    width: '100%',
    height: 180,
    borderRadius: Spacing.three,
  },
  title: {
    width: '60%',
    height: 28,
  },
  line: {
    width: '100%',
    height: 14,
  },
  lineShort: {
    width: '70%',
    height: 14,
  },
  block: {
    width: '100%',
    height: 120,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  counterText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: Spacing.two,
    color: 'red',
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.two,
  },
  statsText: {
    textAlign: 'center',
    color: 'blue',
    marginBottom: Spacing.one,
  },
  listActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  listItemChip: {
    alignItems: 'center',
    margin: Spacing.two,
  },
  listItem: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'blue',
  },
  renderCount: {
    fontSize: 10,
    color: 'gray',
  },
});

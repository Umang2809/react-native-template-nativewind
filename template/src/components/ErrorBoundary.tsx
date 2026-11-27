import React, { ReactNode, ErrorInfo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the app.
 *
 * It sits above ThemeProvider, so it uses fixed Tailwind colors instead of
 * theme tokens: it must render even when a provider is what crashed.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging. Report to Crashlytics/Sentry here.
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-neutral-100 p-5">
          <View className="w-full max-w-[480px] items-center rounded-2xl bg-white p-6 shadow-md">
            <Text className="mb-3 text-center text-title3 text-neutral-800">
              ⚠️ Something Went Wrong
            </Text>
            <Text className="mb-5 text-center text-body1 text-neutral-500">
              The app encountered an unexpected error. Please try restarting.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView className="mb-5 max-h-[200px] w-full rounded-lg bg-red-50 p-3">
                <Text className="mb-2 font-semibold text-red-700">Error Details:</Text>
                <Text className="mb-2 text-caption1 text-red-800">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text className="text-overline text-red-800">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <Pressable
              onPress={this.resetError}
              className="rounded-lg bg-indigo-600 px-8 py-3 active:opacity-80">
              <Text className="text-headline text-white">Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
          <AlertTriangle className="h-16 w-16 text-destructive" />
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Something went wrong
          </h1>
          <p className="max-w-md text-center text-muted-foreground">
            An unexpected error occurred. Please try again or return to the
            dashboard.
          </p>
          <Button onClick={() => (window.location.href = "/portal")}>
            Go to Dashboard
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

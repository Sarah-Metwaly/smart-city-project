import React from 'react';

// Error boundary to catch model loading/rendering errors
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: never }, {message: string}> {
    constructor(props: object) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: never) {
        return { hasError: true, error };
    }
    componentDidCatch(error: never, errorInfo: never) {
        console.error("Error loading model:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // @ts-ignore
            return <div style={{color: 'red'}}>Error loading model: {this.state.error?.message || 'Unknown error'}</div>;
        }
        return this.props.children;
    }
}

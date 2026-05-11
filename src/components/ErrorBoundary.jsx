import React from "react";

export default class ErrorBoundary
  extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {

    return {
      hasError: true
    };
  }

  componentDidCatch(error) {

    console.error(error);
  }

  render() {

    if (
      this.state.hasError
    ) {

      return (
        <div
          className="app-container"
        >
          <h2>
            Something went wrong
          </h2>

          <button
            className="primary-btn"
            onClick={() =>
              window.location.reload()
            }
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

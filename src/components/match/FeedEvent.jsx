return (
  <div
    style={{
      padding: "10px 0",
      marginBottom: "8px",
      color: styles.color,
      fontSize: "1.08rem",
      lineHeight: "1.8",
      letterSpacing: "0.02em",
      opacity: 0,
      animation: "fadeIn 0.6s ease forwards"
    }}
  >
    <div
      dangerouslySetInnerHTML={{
        __html: formatMessage(event.message)
      }}
    />
  </div>
);

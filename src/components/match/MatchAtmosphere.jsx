export default function MatchAtmosphere({
  starting,
  error
}) {

  if (error) {

    return (
      <div className="error-card">
        {error}
      </div>
    );
  }

  if (!starting)
    return null;

  return (

    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "32px 16px"
      }}
    >

      <div
        style={{
          fontSize: 36,
          marginBottom: 12
        }}
      >
        ⚡
      </div>

      <div
        style={{
          fontFamily:
            "Bebas Neue, sans-serif",

          fontSize: 20,

          letterSpacing: 2,

          marginBottom: 8
        }}
      >
        Arena Opening...
      </div>

      <div
        style={{
          color:
            "var(--text3)",

          fontSize: 13
        }}
      >
        Survivors are entering the district.
      </div>

    </div>
  );
}

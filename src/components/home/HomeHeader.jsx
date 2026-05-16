export default function HomeHeader() {

  return (

    <div
      style={{
        marginBottom: 24,
        marginTop: 20,
        textAlign: "center"
      }}
    >

      <div
        style={{
          fontFamily:
            "'Creepster', cursive",

          fontSize: 52,

          letterSpacing: 4,

          color: "#f8fafc",

          textShadow:
            `
            0 0 10px rgba(239,68,68,0.5),
            0 0 25px rgba(239,68,68,0.25),
            0 0 40px rgba(239,68,68,0.15)
            `,

          lineHeight: 1
        }}
      >

        OUTLAST

      </div>

    </div>
  );
}

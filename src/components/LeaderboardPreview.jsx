export default function LeaderboardPreview() {

  const mock = [
    "Rex",
    "Shadow",
    "Tobi"
  ];

  return (
    <div className="card">
      <h3>Top Survivors</h3>

      {mock.map((player, i) => (
        <p key={i}>
          #{i + 1} {player}
        </p>
      ))}
    </div>
  );
}

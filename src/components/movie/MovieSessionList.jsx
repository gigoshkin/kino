import SessionTicket from './SessionTicket';

function groupByHall(sessions) {
  const halls = [];

  sessions.forEach((session) => {
    const hall = halls.find((item) => item.id === session.hall.id);

    if (hall) hall.sessions.push(session);
    else halls.push({ id: session.hall.id, name: session.hall.name, sessions: [session] });
  });

  return halls;
}

export default function MovieSessionList({ groups, disabled, onSelect }) {
  return (
    <div className="flex flex-col gap-6.75">
      {groups.map((group) => (
        <div key={group.venue.id} className="flex flex-col gap-4">
          <p className="text-label font-extrabold">{group.venue.name}</p>
          <div className="flex flex-wrap gap-2.5">
            {groupByHall(group.sessions).map((hall) => (
              <div key={hall.id} className="flex flex-col gap-2.25 rounded-[18px] bg-card p-3.75">
                <p className="text-label-s font-semibold">Hall {hall.name}</p>
                <div className="flex w-106 flex-wrap gap-2.25">
                  {hall.sessions.map((session) => (
                    <SessionTicket
                      key={session.id}
                      session={session}
                      disabled={disabled}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

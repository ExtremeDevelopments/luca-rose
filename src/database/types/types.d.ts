interface GuildDoc {
  
}

interface UserDoc {
  guildID: string,
  id: string,
  elo: {
    current: number,
    total_gained: number,
    total_lost: number
  },
  matches_played: number,
  currentMatchID: string | null
}

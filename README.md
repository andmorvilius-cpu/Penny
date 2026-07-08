git checkout claude/llm-coding-guidelines-9daa3n
npm install
cp .env.example .env
npx prisma migrate dev    # creates the SQLite db + seeds default categories
npm run dev               # http://localhost:3000

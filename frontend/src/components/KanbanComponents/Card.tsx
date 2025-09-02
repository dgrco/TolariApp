export interface ICard {
  id: string,
  content: string,
}

export default function Card({ id, content }: ICard) {
  return (
    <div
      className="flex p-4 items-center bg-gray-600 break-all rounded-xl border border-gray-600 shadow-md touch-none select-none transition-all duration-150 ease-in-out hover:cursor-grab hover:-translate-y-[0.15rem] hover:shadow-xl"
    >
      {content}
    </div>
  )
}

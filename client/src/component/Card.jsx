function Card({ name, depart, url }) {
  // const imageUrl = `http://localhost:5000${url}`;
  const imageUrl = `https://mmcmjk9z-5000.inc1.devtunnels.ms${url}`;

  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      <img src={imageUrl} className="size-12 rounded-full" />
      <div className="mr-auto">
        <p className="font-semibold text-[18px] leading-5">
          {name}
        </p>
        <p className="  text-gray-500 font-normal text-[13px]">{depart}</p>
      </div>
    </div>
  );
}

export default Card;

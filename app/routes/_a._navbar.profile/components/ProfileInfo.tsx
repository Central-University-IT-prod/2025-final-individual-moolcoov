import { useUserStore } from "~/features/user/model/store";

export const ProfileInfo = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <h1 className="text-3xl font-black">{user.name}</h1>
      <div className="flex gap-1.5 font-medium">
        <span>{user.height.value} см</span>
        <span>·</span>
        <span>{user.weight.value} кг</span>
      </div>
    </div>
  );
};

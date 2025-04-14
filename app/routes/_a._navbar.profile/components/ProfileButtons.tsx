import { useUserStore } from "~/features/user/model/store";
import { UserSettingsModal } from "~/features/user/ui/UserSettingsModal";
import { UserStoreModal } from "~/features/user/ui/UserStoreModal";
import {
  GearColoredIcon,
  LottieCoinIcon,
  StoreColoredIcon,
} from "~/shared/ui/icons";

export const ProfileButtons = () => {
  return (
    <div className="flex flex-col gap-3">
      <StoreButton />
      <SettingsButton />
    </div>
  );
};

const StoreButton = () => {
  const user = useUserStore((state) => state.user);

  return (
    <UserStoreModal>
      <button className="bg-muted flex h-[60px] w-full items-center justify-between gap-2 rounded-[20px] border px-5 transition-transform active:scale-[0.95]">
        <div className="flex items-center gap-4">
          <StoreColoredIcon size={28} />
          <h2 className="text-lg font-bold">Магазин</h2>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <LottieCoinIcon size={24} />
              <span className="text-lottie text-lg font-bold">
                {user.coins}
              </span>
            </>
          )}
        </div>
      </button>
    </UserStoreModal>
  );
};

const SettingsButton = () => {
  return (
    <UserSettingsModal>
      <button className="bg-muted flex h-[60px] w-full items-center gap-2 rounded-[20px] border px-5 transition-transform active:scale-[0.95]">
        <div className="flex items-center gap-4">
          <GearColoredIcon size={28} />
          <h2 className="text-lg font-bold">Настройки</h2>
        </div>
      </button>
    </UserSettingsModal>
  );
};

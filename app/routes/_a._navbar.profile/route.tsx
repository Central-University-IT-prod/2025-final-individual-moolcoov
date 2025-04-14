import { ProfileButtons } from "./components/ProfileButtons";
import { CharacterProfile } from "~/features/user/ui/UserCharacter";
import { ProfileInfo } from "./components/ProfileInfo";
import { CharacterModal } from "~/features/user/ui/UserCharacterModal";
import { Button } from "~/shared/ui/Button";
import { PencilIcon } from "~/shared/ui/icons";

export default function ProfilePage() {
  return (
    <div className="flex pb-[62px] lg:max-w-[800px] lg:pt-6 lg:pb-0">
      <div className="relative flex flex-1 flex-col gap-5 lg:px-6">
        <CharacterModal>
          <Button
            className="absolute top-5 right-5 z-10 lg:right-11"
            size={"icon"}
            variant={"secondary"}
          >
            <PencilIcon size={18} />
          </Button>
        </CharacterModal>

        <CharacterProfile />
        <div className="flex flex-col gap-8 px-5">
          <ProfileInfo />
          <ProfileButtons />
          <p className="flex justify-center text-sm font-medium opacity-40">
            2025 for PROD 🤍
          </p>
        </div>
      </div>
    </div>
  );
}

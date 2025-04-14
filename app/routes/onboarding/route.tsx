// в этом файле жесть конечно
// но увы у меня нет времени делать как надо

import { AnimatePresence, motion } from "motion/react";
import React, { type JSX } from "react";
import { redirect, useNavigate, useSearchParams } from "react-router";
import { getUser, saveUser } from "~/features/user/model/storage";
import type { User, UserParameter, UserSex } from "~/features/user/model/types";
import { createEverything } from "~/shared/lib/data";
import { cn } from "~/shared/lib/utils";
import { Button } from "~/shared/ui/Button";
import { ControlButtons } from "~/shared/ui/ControlButtons";
import NumericInput from "~/shared/ui/NumericInput";

export interface UserCreationObject {
  name?: string;
  sex?: UserSex;
  weight?: UserParameter;
  height?: UserParameter;
}

interface UserCreationContextType {
  user: UserCreationObject;
  setUser: React.Dispatch<React.SetStateAction<UserCreationObject>>;
}

const UserCreationContext = React.createContext<
  UserCreationContextType | undefined
>(undefined);

export const clientLoader = async () => {
  if (getUser()) {
    return redirect("/workouts");
  }
};

export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (getUser()) {
      navigate("/workouts");
    }
  }, []);

  const [userObject, setUserObject] = React.useState<UserCreationObject>({});

  const finish = React.useCallback(() => {
    createEverything(userObject).then(() =>
      navigate({
        pathname: "/workouts",
        search: searchParams.toString(),
      }),
    );
  }, [userObject]);

  return (
    <UserCreationContext.Provider
      value={{ user: userObject, setUser: setUserObject }}
    >
      <AnimationBuilder
        blocks={[HiBlock, NameBlock, DataBlock, FinishBlock]}
        finish={finish}
      />
    </UserCreationContext.Provider>
  );
}

const useUserCreation = () => {
  const context = React.useContext(UserCreationContext);
  if (context === undefined) {
    throw new Error(
      "useUserCreation must be used within a UserCreationProvider",
    );
  }
  return context;
};

type AnimationBlock = (props: AnimationBlockProps) => JSX.Element;

interface AnimationBlockProps {
  next: () => void;
}

const AnimationBuilder = ({
  blocks,
  finish,
}: {
  blocks: AnimationBlock[];
  finish: () => void;
}) => {
  const [index, setIndex] = React.useState(0);

  const Block = React.useMemo(() => blocks.at(index), [index]);

  if (!Block) return null;

  const next = React.useCallback(() => {
    if (index === blocks.length - 1) {
      finish();
      return;
    }

    setIndex((prev) => prev + 1);
  }, [index, finish]);

  return (
    <AnimatePresence mode="wait">
      <Block key={index} next={next} />
    </AnimatePresence>
  );
};

const HiBlock: AnimationBlock = ({ next }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    let interval;
    if (index === 0) {
      interval = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 1500);
    } else if (index === 1) {
      interval = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 2500);
    } else {
      interval = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 3000);
    }

    if (index === 4) {
      next();
    }

    return () => clearTimeout(interval);
  }, [index]);

  return (
    <motion.div
      className="flex h-[100dvh] w-screen items-center justify-center"
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-accent fixed top-0 left-0 h-1 w-full"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 9.5 }}
      />
      <AnimatePresence mode="wait">
        {index === 0 && (
          <motion.h1
            key={0}
            initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
            animate={{ translateY: 0, opacity: 1, scale: 1 }}
            exit={{ translateY: "-80%", opacity: 0 }}
            className="mb-[20dvh] text-3xl font-black"
          >
            Привет!
          </motion.h1>
        )}
        {(index === 1 || index === 2) && (
          <motion.div
            key={1}
            className="mb-[20dvh] flex flex-col items-center justify-center gap-2"
            initial={{
              translateY: 0,
              opacity: 1,
            }}
            exit={{
              translateY: "-30%",
              opacity: 0,
            }}
          >
            <motion.h1
              initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
              animate={
                index === 1
                  ? { translateY: 0, opacity: 1, scale: 1, filter: "blur(0)" }
                  : {
                      translateY: "-100%",
                      opacity: 1,
                      scale: 0.9,
                      filter: "blur(2px)",
                      transition: { ease: "easeOut" },
                    }
              }
              className="text-3xl font-black"
            >
              Это — Block
            </motion.h1>
            <motion.h1
              initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
              animate={
                index === 2 && {
                  translateY: 0,
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0)",
                }
              }
              className="px-5 text-center text-3xl font-black text-balance"
            >
              Приложение, которое поможет вам держать себя в форме
            </motion.h1>
          </motion.div>
        )}
        {index === 3 && (
          <motion.h1
            key={2}
            initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
            animate={{ translateY: 0, opacity: 1, scale: 1 }}
            exit={{ translateY: "-80%", opacity: 0 }}
            className="mb-[20dvh] text-3xl font-black"
          >
            Но сначала...
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NameBlock: AnimationBlock = ({ next }) => {
  const { setUser } = useUserCreation();
  const [name, setName] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const [index, setIndex] = React.useState(0);

  const onSubmit = React.useCallback(() => {
    setUser((prev) => ({ ...prev, name }));
    setSubmitted(true);
  }, [name]);

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (name === "" || submitted) {
          return;
        }
        onSubmit();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [name, submitted, onSubmit]);

  React.useEffect(() => {
    if (submitted) {
      let interval;

      if (index === 0) {
        interval = setTimeout(() => {
          setIndex(1);
        }, 1000);
      } else {
        interval = setTimeout(() => {
          next();
        }, 1500);
      }

      return () => clearTimeout(interval);
    }
  }, [submitted, index]);

  return (
    <motion.div
      className="flex h-[100dvh] w-screen flex-col items-center justify-center gap-7 px-5 py-5 text-center"
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.7 } }}
    >
      <AnimatePresence mode="wait">
        {index === 0 && (
          <motion.div
            key={0}
            className="flex flex-1 flex-col items-center justify-center gap-6"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h1
              initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
              animate={{ translateY: 0, opacity: 1, scale: 1 }}
              className="text-3xl font-black"
            >
              Как вас зовут?
            </motion.h1>
            <motion.input
              initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
              animate={{
                translateY: 0,
                opacity: 1,
                scale: 1,
                transition: { delay: 1.5 },
              }}
              placeholder="Введите свое имя"
              className="w-full text-center text-2xl font-bold outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </motion.div>
        )}

        {index === 1 && (
          <motion.h1
            initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
            animate={{ translateY: 0, opacity: 1, scale: 1 }}
            className="text-3xl font-black text-balance"
          >
            Очень приятно, {name}
          </motion.h1>
        )}
      </AnimatePresence>
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={
          submitted
            ? { opacity: 0 }
            : { opacity: 1, transition: { delay: 2.5, duration: 1 } }
        }
      >
        <Button
          disabled={name === ""}
          onClick={!submitted ? onSubmit : undefined}
          className="m-auto lg:max-w-xl"
        >
          ДАЛЕЕ
        </Button>
      </motion.div>
    </motion.div>
  );
};

const DataBlock: AnimationBlock = ({ next }) => {
  const [index, setIndex] = React.useState(0);
  const [blockIndex, setBlockIndex] = React.useState(0);
  const { user } = useUserCreation();

  const nextBlock = React.useCallback(() => {
    if (blockIndex === 2) {
      setIndex(2);
      return;
    }
    setBlockIndex((prev) => prev + 1);
  }, [blockIndex]);

  React.useEffect(() => {
    if (index === 0) {
      const interval = setTimeout(() => {
        setIndex(1);
      }, 2500);
      return () => clearTimeout(interval);
    }
  }, [index]);

  return (
    <motion.div
      className="relative flex h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden text-center"
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {(index === 0 || index === 1) && (
          <motion.div
            key={"a"}
            animate={
              index === 0
                ? { top: "auto" }
                : {
                    top: "25px",
                    transition: { duration: 0.8, ease: "easeOut" },
                  }
            }
            exit={{ opacity: 0 }}
            className="absolute mb-13 flex flex-col gap-2"
          >
            <motion.h1
              className="text-3xl font-black"
              initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
              animate={{ translateY: 0, opacity: 1, scale: 1 }}
            >
              Расскажите о себе побольше
            </motion.h1>
            <motion.p
              className="text-muted-foreground font-medium text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8, duration: 1 } }}
            >
              С помощью этих данных, я смогу рассчитать нагрузку
            </motion.p>
          </motion.div>
        )}
        {index === 1 && (
          <AnimatePresence propagate key={"b"}>
            {blockIndex === 0 && <DataBlockSex key={0} next={nextBlock} />}
            {blockIndex === 1 && <DataBlockHeight key={1} next={nextBlock} />}
            {blockIndex === 2 && <DataBlockWeight key={2} next={nextBlock} />}
          </AnimatePresence>
        )}
        {index === 2 && (
          <>
            {user.height?.value === 170 && user.weight?.value === 50 ? (
              <DataBlockSuspicious next={next} />
            ) : (
              <DataBlockOk next={next} />
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DataBlockSex = ({ next }: { next: () => void }) => {
  const [sex, setSex] = React.useState<UserSex>();
  const { setUser } = useUserCreation();

  const onSubmit = React.useCallback(() => {
    setUser((prev) => ({ ...prev, sex }));
    next();
  }, [sex, next]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col px-5 py-5"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        translateX: 0,
        transition: { duration: 1, delay: 0.5 },
      }}
      exit={{
        opacity: 0,
        translateX: "-100%",
        transition: {
          duration: 0.4,
          ease: "easeInOut",
        },
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <p className="font-bold">Пол</p>
        <div className="flex gap-3">
          <button
            className={cn(
              "bg-muted rounded-2xl px-4 py-3 font-medium transition-transform active:scale-[0.95]",
              {
                "text-background-100 bg-white": sex === "male",
              },
            )}
            onClick={() => setSex("male")}
          >
            Мужской
          </button>
          <button
            className={cn(
              "bg-muted rounded-2xl px-4 py-3 font-medium transition-transform active:scale-[0.95]",
              {
                "text-background-100 bg-white": sex === "female",
              },
            )}
            onClick={() => setSex("female")}
          >
            Женский
          </button>
        </div>
      </div>
      <ControlButtons disabled={!sex} onNext={onSubmit} label="ДАЛЕЕ" />
    </motion.div>
  );
};

const tooShortMessage =
  "Давайте по-честному! Но если вы и вправду ТАКОЙ коротыш, можем продолжить, но мои расчеты тренировок могут быть неверными";

const tooLongMessage =
  "Давайте по-честному! Но если вы и вправду ТАКОЙ великан, можем продолжить, но мои расчеты тренировок могут быть неверными";

const DataBlockHeight = ({ next }: { next: () => void }) => {
  const { setUser } = useUserCreation();
  const [height, setHeight] = React.useState(170);

  const [message, setMessage] = React.useState("");

  const onSubmit = React.useCallback(() => {
    if (height < 50) {
      setMessage("Вы либо гном, либо не умеете врать");
      return;
    }

    if (height <= 100 && message != tooShortMessage) {
      setMessage(tooShortMessage);
      return;
    }

    if (height >= 230 && message != tooLongMessage) {
      setMessage(tooLongMessage);
      return;
    }

    setUser((prev) => ({
      ...prev,
      height: { value: height, date: new Date() },
    }));
    next();
  }, [height, next]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col px-5 py-5"
      initial={{ opacity: 0, translateX: "100%" }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: "-100%" }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="font-bold">Рост</p>
        <NumericInput min={0} max={250} value={height} onChange={setHeight} />
      </div>
      {message && (
        <p className="absolute bottom-24 left-0 w-full px-5 text-center text-sm font-medium text-balance text-red-500">
          {message}
        </p>
      )}
      <ControlButtons onNext={onSubmit} label="ДАЛЕЕ" />
    </motion.div>
  );
};

const weightMessage =
  "Давайте по-честному! Но если вы и вправду столько весите, можем продолжить, но мои расчеты тренировок могут быть неверными";

const DataBlockWeight = ({ next }: { next: () => void }) => {
  const { setUser } = useUserCreation();
  const [weight, setWeight] = React.useState(50);

  const [message, setMessage] = React.useState("");

  const onSubmit = React.useCallback(() => {
    if (weight <= 20) {
      setMessage("Как вас еще ветром не сдуло");
      return;
    }

    if (weight <= 35 && message != weightMessage) {
      setMessage(weightMessage);
      return;
    }

    setUser((prev) => ({
      ...prev,
      weight: { value: weight, date: new Date() },
    }));
    next();
  }, [weight, next]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col px-5 py-5"
      initial={{ opacity: 0, translateX: "100%" }}
      animate={{
        opacity: 1,
        translateX: 0,
        transition: {
          duration: 0.4,
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="font-bold">Вес</p>
        <NumericInput min={0} max={200} value={weight} onChange={setWeight} />
      </div>
      {message && (
        <p className="absolute bottom-24 left-0 w-full px-5 text-center text-sm font-medium text-balance text-red-500">
          {message}
        </p>
      )}
      <ControlButtons onNext={onSubmit} label="СОХРАНИТЬ" />
    </motion.div>
  );
};

const DataBlockOk = ({ next }: { next: () => void }) => {
  React.useEffect(() => {
    const interval = setTimeout(() => {
      next();
    }, 4000);
    return () => clearTimeout(interval);
  }, []);

  return (
    <motion.div className="flex items-center justify-center">
      <motion.h1
        className="mb-8 text-center text-3xl font-black text-balance"
        initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
        animate={{
          translateY: 0,
          opacity: 1,
          scale: 1,
          transition: { delay: 0.8 },
        }}
      >
        Спасибо, что ответственно заполнили данные!
      </motion.h1>
    </motion.div>
  );
};

const DataBlockSuspicious = ({ next }: { next: () => void }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    let interval;

    if (index === 0) {
      interval = setTimeout(() => {
        setIndex(1);
      }, 4000);
    } else {
      interval = setTimeout(() => {
        next();
      }, 3500);
    }

    return () => clearTimeout(interval);
  }, [index]);

  return (
    <motion.div className="relative flex items-center justify-center">
      <AnimatePresence>
        {index === 0 && (
          <motion.h1
            key={0}
            className="absolute mb-8 w-screen px-5 text-center text-3xl font-black text-balance"
            initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
            animate={{
              translateY: 0,
              opacity: 1,
              scale: 1,
              transition: { delay: 0.8 },
            }}
            exit={{ opacity: 0 }}
          >
            Похоже, у вас совсем нет времени, чтобы указать всего 2 числа...
          </motion.h1>
        )}
        {index === 1 && (
          <motion.h1
            key={1}
            className="absolute mb-8 w-screen px-5 text-center text-3xl font-black text-balance"
            initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
            animate={{
              translateY: 0,
              opacity: 1,
              scale: 1,
              transition: { delay: 0.5 },
            }}
          >
            Хотя может, ваш рост действительно 170, а вес 50
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FinishBlock: AnimationBlock = ({ next }) => {
  React.useEffect(() => {
    const interval = setTimeout(() => {
      next();
    }, 4000);
    return () => clearTimeout(interval);
  }, [next]);

  return (
    <motion.div
      className="flex h-[100dvh] w-screen items-center justify-center overflow-hidden"
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1
        className="mb-8 w-screen px-5 text-center text-3xl font-black text-balance"
        initial={{ translateY: "100%", opacity: 0, scale: 0.8 }}
        animate={{
          translateY: 0,
          opacity: 1,
          scale: 1,
          transition: { delay: 0.8 },
        }}
      >
        На этом всё!
      </motion.h1>
    </motion.div>
  );
};

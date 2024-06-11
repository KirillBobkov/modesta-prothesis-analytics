import React, { useState, useEffect, useCallback } from "react";
import styles from "./TwoColumnLayout.module.css";
import {
  Button,
  IconButton,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { Subscription } from "rxjs";
import { connect, disconnect, getStatus, read } from "./connect";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { useGaugeState } from "@mui/x-charts/Gauge";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { fromEvent, interval } from "rxjs";
import { mapTo, scan, startWith, tap } from "rxjs/operators";
import BluetoothRoundedIcon from "@mui/icons-material/BluetoothRounded";
import BluetoothDisabledRoundedIcon from "@mui/icons-material/BluetoothDisabledRounded";

const INITIAL_COUNT = 0;

// Функция для создания Observable счётчика
export function createCounterObservable() {
  // Создаём поток интервалов, который будет увеличивать значение счётчика каждую секунду
  const counter$ = interval(1000).pipe(
    // Используем scan для накопления значений
    scan((acc, _) => acc + 1),
    // Начинаем с начального значения
    startWith(INITIAL_COUNT)
  );

  return counter$;
}

function formatSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600); // Часы
  seconds %= 3600; // Остаток от деления на 3600 (минуты)

  const minutes = Math.floor(seconds / 60); // Минуты
  seconds %= 60; // Секунды

  return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${(
    "0" + seconds
  ).slice(-2)}`;
}

const TwoColumnLayout: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | undefined>(
    undefined
  );
  const [counterSub, setCounterSub] = useState<Subscription | undefined>(
    undefined
  );
  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [currentValue, setCurrentValue] = useState<any[] | undefined>(
    undefined
  );
  const [timeStart, setSeconds] = useState<number>(parseInt(localStorage.getItem("counterValue") || '0') || 0);
  const connected = getStatus();

  const handleConnect = useCallback(() => {
    const newSubscription = connect().subscribe((value: any) => {
      const parsed = value.split(",");
      if (Array.isArray(parsed)) {
        setCurrentValue(parsed);
      }
    });
    setSubscription(newSubscription);

    // Пример использования
    const counterObj = createCounterObservable();
    const newSubscription2 = counterObj.subscribe({
      next: (value) => {
        connected && setSeconds(v => v + 1);
      },
    });

    setCounterSub(newSubscription2);
  }, [connected]);

  useEffect(() => {
    localStorage.setItem("counterValue", `${timeStart}`);
  }, [timeStart])

  const handleDisconnect = useCallback(() => {
    disconnect();
    subscription?.unsubscribe();
    setSubscription(undefined);
    counterSub?.unsubscribe();
    setCounterSub(undefined);
  }, [subscription, counterSub]);

  useEffect(() => {
    if (currentValue !== undefined) {
      setTrainingData((prevData) =>
        prevData.length >= 20
          ? [...prevData.slice(1), currentValue]
          : [...prevData, currentValue]
      );
    }
  }, [currentValue]);


  const newTheme = createTheme({ palette: { mode: "dark" } });
  return (
    <ThemeProvider theme={newTheme}>
      <div className={styles.layout}>
        <div className={`${styles.column} ${styles.columnLeft}`}>
          <div className={styles.navigation}>
            <div className={styles.navigation__logo}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 462 800"
                height={25}
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g>
                  <path d="M -0.5,-0.5 C 27.1667,-0.5 54.8333,-0.5 82.5,-0.5C 82.369,0.238911 82.5357,0.905578 83,1.5C 137.233,55.7331 191.4,109.9 245.5,164C 226.694,183.973 207.36,203.473 187.5,222.5C 152.819,187.986 117.986,153.652 83,119.5C 82.5,189.499 82.3333,259.499 82.5,329.5C 54.8333,329.5 27.1667,329.5 -0.5,329.5C -0.5,219.5 -0.5,109.5 -0.5,-0.5 Z" />
                </g>
                <g>
                  <path d="M 461.5,1.5 C 461.5,111.5 461.5,221.5 461.5,331.5C 433.833,331.5 406.167,331.5 378.5,331.5C 378.5,221.5 378.5,111.5 378.5,1.5C 406.167,1.5 433.833,1.5 461.5,1.5 Z" />
                </g>
                <g>
                  <path d="M -0.5,397.5 C 153.167,397.5 306.833,397.5 460.5,397.5C 460.5,425.167 460.5,452.833 460.5,480.5C 306.833,480.5 153.167,480.5 -0.5,480.5C -0.5,452.833 -0.5,425.167 -0.5,397.5 Z" />
                </g>
                <g>
                  <path d="M -0.5,555.5 C 153.5,555.5 307.5,555.5 461.5,555.5C 461.5,583.167 461.5,610.833 461.5,638.5C 307.5,638.5 153.5,638.5 -0.5,638.5C -0.5,610.833 -0.5,583.167 -0.5,555.5 Z" />
                </g>
                <g>
                  <path d="M -0.5,702.5 C 153.167,702.5 306.833,702.5 460.5,702.5C 460.5,730.167 460.5,757.833 460.5,785.5C 306.833,785.5 153.167,785.5 -0.5,785.5C -0.5,757.833 -0.5,730.167 -0.5,702.5 Z" />
                </g>
              </svg>
            </div>

            <a
              target="_blank"
              href="https://navigator.sk.ru/orn/1125414"
              className={styles["navigation__item--external"]}
              itemProp="url"
            >
              <svg
                className={styles.navigation__imgSK}
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                viewBox="0 0 436.000000 436.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,436.000000) scale(0.100000,-0.100000)"
                  stroke="none"
                >
                  <path
                    d="M886 4344 c-219 -43 -408 -144 -567 -303 -161 -162 -262 -351 -304
                                -574 -23 -121 -23 -2495 1 -2617 63 -332 282 -624 583 -774 167 -83 14 -77
                                1616 -74 l1430 3 92 41 c120 54 220 122 316 213 132 126 229 274 282 432 l25
                                73 0 1798 0 1798 -1702 -1 c-1396 -1 -1715 -3 -1772 -15z m3364 -1728 c0
                                -1085 -3 -1629 -11 -1681 -49 -355 -309 -664 -649 -773 -151 -48 -113 -47
                                -1385 -47 -990 0 -1212 2 -1270 14 -400 80 -696 377 -770 773 -14 74 -15 228
                                -13 1299 l3 1214 22 80 c48 169 168 367 289 474 148 131 340 219 524 240 41 5
                                792 9 1668 10 l1592 1 0 -1604z"
                  />
                  <path
                    d="M1375 3280 c-279 -37 -511 -240 -579 -506 -25 -99 -21 -240 10 -332
                                86 -257 284 -393 655 -452 393 -62 473 -92 520 -195 41 -89 9 -203 -76 -264
                                -69 -49 -145 -72 -266 -78 -133 -7 -223 12 -307 66 -76 50 -140 146 -142 214
                                0 16 -18 17 -226 17 l-227 0 7 -61 c28 -240 177 -455 391 -561 217 -108 538
                                -127 780 -47 89 30 209 93 235 123 24 30 30 16 30 -64 l0 -80 210 0 210 0 0
                                258 0 258 69 75 c38 41 71 72 73 69 3 -3 94 -149 202 -325 109 -176 201 -323
                                205 -328 4 -4 116 -6 249 -5 l242 3 -299 494 -299 493 299 328 c164 181 299
                                331 299 334 0 3 -121 6 -269 6 l-268 0 -244 -267 -244 -267 -3 542 -2 542
                                -210 0 -210 0 0 -126 0 -126 -70 65 c-173 160 -455 235 -745 197z m359 -420
                                c77 -29 147 -95 186 -173 16 -33 30 -66 30 -74 0 -10 26 -13 120 -13 l120 0 0
                                -185 0 -185 -62 35 c-86 46 -206 79 -405 110 -314 49 -392 72 -462 138 -120
                                114 -56 288 132 358 74 28 256 22 341 -11z"
                  />
                </g>
              </svg>
              <span>Участник</span>
            </a>
          </div>
          <div className={styles.title} style={{ width: "100%" }}>
            Модеста мониторинг
          </div>
          <div style={{ marginTop: "30px" }}></div>
          <div className={styles.container_buttons}>
            <h1 className={styles.secondary_title}>Управление Bluetooth</h1>
            <div className={styles.buttons}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#DCE359" }}
                onClick={handleConnect}
              >
                Подключить
              </Button>
              <Button
                variant="outlined"
                style={{ borderColor: "#DCE359", color: "#DCE359" }}
                onClick={handleDisconnect}
              >
                Отключить
              </Button>
            </div>
            {!connected ? (
              <h1 className={styles.status}>
                <BluetoothDisabledRoundedIcon />
                <span>Отключено</span>
              </h1>
            ) : (
              <h1 className={styles.status}>
                <BluetoothRoundedIcon />
                <span>Подключено</span>
              </h1>
            )}
          </div>
          <div style={{ marginTop: "30px" }}></div>
          <h2 className={styles.menu_link}>
            <span>Комплектация</span>
            <Tooltip title="Функционал недоступен, так как находится в разработке">
              <IconButton>
                <InfoRoundedIcon />
              </IconButton>
            </Tooltip>
          </h2>
          <h2 className={styles.menu_link}>
            <span>Ремонт{" "}</span>
            <Tooltip title="Функционал недоступен, так как находится в разработке">
              <IconButton>
                <InfoRoundedIcon />
              </IconButton>
            </Tooltip>
          </h2>
          <h2 className={styles.menu_link}>
            <span>Прогресс{" "}</span>
            <Tooltip title="Функционал недоступен, так как находится в разработке">
              <IconButton>
                <InfoRoundedIcon />
              </IconButton>
            </Tooltip>
          </h2>
          <h2 className={styles.menu_link}>
            <span>Рейтинг{" "}</span>
            <Tooltip title="Функционал недоступен, так как находится в разработке">
              <IconButton>
                <InfoRoundedIcon />
              </IconButton>
            </Tooltip>
          </h2>
          <h2 className={styles.menu_link}>
            <span>Задания{" "}</span>
            <Tooltip title="Функционал недоступен, так как находится в разработке">
              <IconButton>
                <InfoRoundedIcon />
              </IconButton>
            </Tooltip>
          </h2>
        </div>
        <div className={`${styles.column} ${styles.columnCenter}`}>
          <div className={styles.title} style={{ width: "100%" }}>
            Уровень активности
          </div>

          <div className={styles.charts}>
            <ChartComponent
              title="Ось X"
              data={trainingData.map((tr) => tr[0])}
            />
            <ChartComponent
              title="Ось Y"
              data={trainingData.map((tr) => tr[1])}
            />
            <ChartComponent
              title="Ось Z"
              data={trainingData.map((tr) => tr[2])}
            />

            <div className={styles.container_chart_part}>
              <h1 className={styles.secondary_title}>Заряд </h1>
              <Gauge
                {...{
                  width: 200,
                  height: 200,
                  value: connected ? 87 : 0,
                }}
                title={"Заряд"}
                cornerRadius="50%"
                text={({ value, valueMax }) => `${value}%`}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 40,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#DCE359",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })}
              />
            </div>

            <div className={styles.container_chart_part}>
              <h1 className={styles.secondary_title}>
                Общее время использования
              </h1>
              <h1 className={styles.title}>{connected ? formatSeconds(timeStart ?? 0) : '-'}</h1>
            </div>
          </div>
          <div
            className={styles.title}
            style={{ marginTop: "30px", width: "100%" }}
          >
            Расход комплектующих
          </div>
          <div className={styles.charts_2}>
            <div className={styles.container_chart_2}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1 className={styles.secondary_title}>Втулки</h1>
                <Tooltip title="Расход отображается корректно только при использовании протеза с блютузом">
                  <IconButton>
                    <InfoRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <CompositionExample val={connected ? 93 : 0} />
            </div>

            <div className={styles.container_chart_2}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1 className={styles.secondary_title}>Пружины</h1>
                <Tooltip title="Расход отображается корректно только при использовании протеза с блютузом">
                  <IconButton>
                    <InfoRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <CompositionExample val={connected ? 98 : 0} />
            </div>

            <div className={styles.container_chart_2}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1 className={styles.secondary_title}>Наконечник</h1>
                <Tooltip title="Расход отображается корректно только при использовании протеза с блютузом">
                  <IconButton>
                    <InfoRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <CompositionExample val={connected ? 85 : 0} />
            </div>

            <div className={styles.container_chart_2}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h1 className={styles.secondary_title}>Нити</h1>
                <Tooltip title="Расход отображается корректно только при использовании протеза с блютузом">
                  <IconButton>
                    <InfoRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <CompositionExample val={connected ? 97 : 0} />
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.columnRight}`}>
          <Profile connected={connected} />
        </div>
      </div>
    </ThemeProvider>
  );
};
interface ChartComponentProps {
  title: string;
  data: number[];
}
const ChartComponent: React.FC<ChartComponentProps> = ({ title, data }) => (
  <div className={styles.container_chart}>
    <h1 className={styles.secondary_title}>{title}</h1>
    <LineChart
      margin={{
        left: 40,
        right: 10,
        top: 0,
        bottom: 20,
      }}
      series={[
        {
          data: data,
          showMark: false,
          disableHighlight: true,
          connectNulls: true,
          color: "#DCE359",
        },
      ]}
    />
  </div>
);

const Profile = ({ connected }: any) => (
  <div>
    <div className={styles.person}>
      <div className={styles["person__avatar-container"]}>
        <img
          alt="Портрет члена команды"
          className={styles["person__avatar"]}
          src={
            connected
              ? "https://www.womanhit.ru/media/CACHE/images/articleimage2/2019/8/margo/a6c184fd913aa69ac5ee8fbf8bea049b.jpg"
              : "https://raw.githubusercontent.com/Mikescher/CS_GO_Avatars/master/question%20mark.png"
          }
        />
        <p itemProp="name" className={styles["person__name"]}>
          {connected ? "Ксения Ситоленко" : "-"}
        </p>
      </div>
    </div>

    <table>
      <tr>
        <td>Дата рождения</td>
        <td className={styles["person__profession"]}>
          {connected ? "22.02.1994" : "-"}
        </td>
      </tr>
      <tr>
        <td>Телефон</td>
        <td>
          <p className={styles["person__profession"]}>
            <a href="tel:+79991202332">
              {connected ? "+7 999 120 23 32" : "-"}
            </a>
          </p>
        </td>
      </tr>
      <tr>
        <td>E-mail</td>
        <td>
          <p className={styles["person__profession"]}>
            <a href="mailto:test@mail.ru">{connected ? "test@mail.ru" : "-"}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td>Статус</td>
        <td>
          <p className={styles["person__profession"]}>
            {connected ? "Новичок (Меньше 100 часов использования)" : "-"}
          </p>
        </td>
      </tr>
      <tr>
        <td>Идентификатор</td>
        <td>
          <p className={styles["person__profession"]}>
            {connected ? "XF-434" : "-"}
          </p>
        </td>
      </tr>
    </table>
  </div>
);

export default TwoColumnLayout;

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

function CompositionExample({ val }: any) {
  return (
    <Gauge
      value={val}
      startAngle={-110}
      endAngle={110}
      sx={{
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 30,
          transform: "translate(0px, 0px)",
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: "#DCE359",
        },
      }}
      text={({ value, valueMax }) => `${value}%`}
    />
  );
}

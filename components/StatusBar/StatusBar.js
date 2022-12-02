import styles from "./StatusBar.module.css";
import Pill from "../Pill";

export default function StatusBar({ isLive, streamResolution }) {
  let statusPill =
    isLive ? (
      <Pill type="destruct">LIVE</Pill>
    ) : (
      <Pill>OFFLINE</Pill>
    );
  const resolution = `${streamResolution}p`;

  return (
    <div className={styles.statusBar}>
      {statusPill}
      <Pill>{resolution}</Pill>
    </div>
  );
}

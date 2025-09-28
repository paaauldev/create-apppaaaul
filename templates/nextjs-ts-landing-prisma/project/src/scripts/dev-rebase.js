import { execSync } from "child_process";

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

try {
  const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

  run("git fetch origin");
  run("git checkout dev");
  run("git pull origin dev");
  run(`git checkout ${branch}`);
  run("git rebase dev");
  run("git checkout dev");
  run(`git merge ${branch}`);

  // Verificar si la rama ya está mergeada en dev
  const isMerged = execSync(`git branch --merged dev`).toString().includes(branch);

  if (isMerged) {
    run(`git branch -d ${branch}`);
    // Eliminar la rama del repositorio remoto si existe
    try {
      run(`git push origin --delete ${branch}`);
      console.error(`✅ Rama ${branch} rebaseada, mergeada en dev y eliminada local y remotamente`);
    } catch (remoteDeleteError) {
      console.error(
        `✅ Rama ${branch} rebaseada, mergeada en dev y eliminada localmente (no existía en remoto)`,
      );
    }
  } else {
    console.error(
      `⚠️ La rama ${branch} todavía no está completamente mergeada en dev, no se elimina.`,
    );
  }
  run("git push origin dev");
  run("git remote prune origin");
} catch (err) {
  console.error("❌ Error en el proceso:", err.message);
  process.exit(1);
}

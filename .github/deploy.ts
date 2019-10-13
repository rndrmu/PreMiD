import * as Client from "ssh2-sftp-client";
import * as archiver from "archiver";
import { platform, arch } from "os";
import { createWriteStream, readdirSync } from "fs";

let sftp = new Client();

sftp
  .connect({
    host: process.env.SSH_HOST,
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD
  })
  .then(async () => {
    console.log("Zipping...");
    let output = createWriteStream("app.zip"),
      archive = archiver("zip");

    archive.directory(`../dist/`, platform());

    output.on("close", function() {
      console.log("Uploading...");
      sftp
        .fastPut("app.zip", `/home/PreMiD/builds/${platform()}.zip`)
        .then(() => {
          console.log("Done!");
          sftp.end();
        });
    });

    archive.on("error", function(err) {
      sftp.end();
      throw err;
    });

    archive.pipe(output);

    archive.finalize();
  });

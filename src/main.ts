import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

export type CheckerOptions = {
    compilerOptions?: Partial<ts.CompilerOptions>;
    workingDir?: string;
}

export function checker(typeName: string, module: string, opts?: CheckerOptions) {

    const testScriptFileName = "./testScript.ts";

    const rootFileNames = [
        module,
        testScriptFileName
    ];

    const options: ts.CompilerOptions = {
        module: ts.ModuleKind.ESNext,
        noEmit: true,
        resolveJsonModule: true,
        esModuleInterop: true,
        ... opts?.compilerOptions ?? {}
    };

    const wd = opts?.workingDir ?? process.cwd();

    const files: ts.MapLike<{ version: number }> = {};

    // initialize the list of files
    rootFileNames.forEach(fileName => {
        files[fileName] = { version: 0 };
    });

    // Create the language service host to allow the LS to communicate with the host
    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => rootFileNames,
        getScriptVersion: fileName =>
            files[fileName] && files[fileName].version.toString(),
        getScriptSnapshot: fileName => {
            if (fileName == testScriptFileName) {
                return ts.ScriptSnapshot.fromString(testScript);
            }

            fileName = path.isAbsolute(fileName) ? fileName : path.join(wd, fileName);

            if (!fs.existsSync(fileName)) {
                return undefined;
            }

            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => wd,
        getCompilationSettings: () => options,
        getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
        fileExists: (p) => ts.sys.fileExists(p),
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        directoryExists: ts.sys.directoryExists,
        getDirectories: ts.sys.getDirectories,
    };

    // Create the language service files
    const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    function getDiagnostics(fileName: string): ts.Diagnostic[] {
        return services.getSemanticDiagnostics(fileName);
    }

    let testScript: string;

    function checkJson(value: string) {

        testScript = `
            import { ${typeName} } from "${module}";
            const v: ${typeName} = ${value};
        `;

        files[testScriptFileName].version++;

        const ds = getDiagnostics(testScriptFileName)

        if (ds.length > 0) {
            if (process.env && process.env.TS_CHECKER_DIAGNOSTICS) {
                printDiagnostic(ds);
            }
            return false;
        }

        return true;
    }

    function checkValue(val: any) {
        return checkJson(JSON.stringify(val))
    }

    return {
        checkJson,
        checkValue
    }
}

function printDiagnostic(allDiagnostics: ts.Diagnostic[]) {

    allDiagnostics.forEach(diagnostic => {
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                diagnostic.start!
            );
            console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(`  Error: ${message}`);
        }
    });
}

import * as vscode from 'vscode';
import axios from 'axios';
import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import { Features, MicronautFeatureService } from './service/micronaut-feature.service';
import { FeatureResponse } from './domain/feature/feature-reponse';

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('micronaut-launch-vscode.createProject', async () => {
        try {
            const appTypeSelection = await vscode.window.showQuickPick([
                { label: 'Web Application', value: Features.DEFAULT },
                { label: 'Command Line Application', value: Features.CLI },
                { label: 'Serverless Function', value: Features.FUNCTION },
                { label: 'gRPC Application', value: Features.GRPC },
                { label: 'Messaging-Driven Application', value: Features.MESSAGING }
            ], {
                placeHolder: 'Application Type'
            });
            if (!appTypeSelection) { return; }
            

            const featureResponse: FeatureResponse = await MicronautFeatureService.getFeatures(appTypeSelection.value);

            const options = featureResponse.features.map(feature => {
                return {
                    label: feature.name,
                    description: feature.title,
                    detail: feature.description
                };
            });

            const featuresSelected = await vscode.window.showQuickPick(options, {
                placeHolder: 'Selecione uma ou mais features adicionais',
                canPickMany: true,
                matchOnDescription: true,
                matchOnDetail: true
            });

            if (!featuresSelected) { 
                return; 
            }
            const features: string[] = featuresSelected.map(item => item.label);

            const lang = await vscode.window.showQuickPick(['java', 'kotlin', 'groovy'], {
                placeHolder: 'Language'
            });
            if (!lang) {return;}

            const build = await vscode.window.showQuickPick(['gradle', 'gradle_kotlin', 'maven'], {
                placeHolder: 'Build Tool'
            });
            if (!build) {return;}

            const test = await vscode.window.showQuickPick(['JUNIT', 'SPOCK', 'KOTEST'], {
                placeHolder: 'Test Framework'
            });
            if (!test) {return;}

            const projectFQCN = await vscode.window.showInputBox({
                prompt: 'Base Package (ex: com.example.myapp)',
                value: 'com.example.demo'
            });
            if (!projectFQCN) {return;}

            const javaVersion = await vscode.window.showQuickPick(['JDK_25'], {
                placeHolder: 'Java Version'
            });
            if (!javaVersion) {return;}

            const targetFolderUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select folder for project'
            });
            if (!targetFolderUri || targetFolderUri.length === 0) {return;}
            const targetFolder = targetFolderUri[0].fsPath;

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Generating the Micronaut project...",
                cancellable: false
            }, async (progress) => {

                const url = `https://launch.micronaut.io/create/default/${projectFQCN}`;
                //const url = `http://0.0.0.0:8089/${projectFQCN}`;
                console.log(features);

                const response = await axios.get(url, {
                    params: { lang, build, javaVersion, test: test, features: features },
                    responseType: 'arraybuffer',
                    paramsSerializer: {
                        indexes: null
                    }
                });
                const now = new Date().toISOString().replace(/[:.]/g, '-');
                const zipPath = path.join(targetFolder, `project-${now}.zip`);
                fs.writeFileSync(zipPath, response.data);

                const zip = new AdmZip(zipPath);
                zip.extractAllTo(targetFolder, true);

                fs.unlinkSync(zipPath);

                const projectName = projectFQCN.split('.').pop() || 'demo';
                const projectPath = path.join(targetFolder, projectName);

                const openChoice = await vscode.window.showInformationMessage(
                    'Micronaut project successfully created!', 'Open project'
                );

                if (openChoice === 'Open project') {
                    const uri = vscode.Uri.file(projectPath);
                    vscode.commands.executeCommand('vscode.openFolder', uri, true);
                }
            });

        } catch (error: any) {
            vscode.window.showErrorMessage(`Error creating Micronaut project: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

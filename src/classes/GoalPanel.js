const GOAL = {
    title: "30 dias sem apostar",
    startDate: "05/10/2026",
    endDate: "03/11/2026",
    totalDays: 30,
    completedDays: 30,
    rewardCoins: 300,
};

const WEEKS = [
    "05/10 a 11/10",
    "12/10 a 18/10",
    "19/10 a 25/10",
    "26/10 a 01/11",
    "02/11 a 03/11",
];

const RECORDS = [
    { date: "07/10/2026", week: 1, value: 50, trigger: "Jogo de futebol" },
    { date: "10/10/2026", week: 1, value: 80, trigger: "Dia de pagamento" },
    { date: "14/10/2026", week: 2, value: 30, trigger: "Tédio à noite" },
    { date: "17/10/2026", week: 2, value: 70, trigger: "Fim de semana" },
    { date: "21/10/2026", week: 3, value: 40, trigger: "Notificação de promoção" },
    { date: "24/10/2026", week: 3, value: 100, trigger: "Jogo de futebol" },
    { date: "28/10/2026", week: 4, value: 60, trigger: "Estresse no trabalho" },
    { date: "31/10/2026", week: 4, value: 70, trigger: "Fim de semana" },
    { date: "02/11/2026", week: 5, value: 40, trigger: "Tédio à noite" },
];

class GoalPanel {
    constructor(onContinue) {
        if (typeof onContinue !== "function") {
            throw new TypeError("GoalPanel exige uma função para continuar ao jogo.");
        }

        this.onContinue = onContinue;
        this.root = null;
        this.card = null;
        this.opener = null;
        this.handleKeydown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                this.hide();
                return;
            }

            if (event.key !== "Tab" || !this.root) return;

            const buttons = [...this.root.querySelectorAll("button")];
            const firstButton = buttons[0];
            const lastButton = buttons[buttons.length - 1];

            if (event.shiftKey && document.activeElement === firstButton) {
                event.preventDefault();
                lastButton.focus();
            } else if (!event.shiftKey && document.activeElement === lastButton) {
                event.preventDefault();
                firstButton.focus();
            }
        };
    }

    show() {
        if (this.root) return;

        this.opener = document.activeElement;
        this.root = this.createElement("div", "goal-panel");
        this.root.setAttribute("role", "dialog");
        this.root.setAttribute("aria-modal", "true");
        this.root.setAttribute("aria-label", "Meta e relatório demonstrativo");

        this.card = this.createElement("div", "goal-panel__card");
        this.root.append(this.card);
        document.body.append(this.root);
        document.addEventListener("keydown", this.handleKeydown);

        this.showGoalView();
    }

    hide() {
        if (!this.root) return;

        this.root.remove();
        this.root = null;
        this.card = null;
        document.removeEventListener("keydown", this.handleKeydown);

        if (this.opener instanceof HTMLElement && this.opener.isConnected) {
            this.opener.focus({ preventScroll: true });
        }
        this.opener = null;
    }

    continueToGame() {
        this.hide();
        this.onContinue();
    }

    createElement(tag, className = "", text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    createButton(label, onClick, primary = false) {
        const button = this.createElement(
            "button",
            primary
                ? "goal-panel__button goal-panel__button--primary"
                : "goal-panel__button",
            label
        );
        button.type = "button";
        button.addEventListener("click", onClick);
        return button;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    }

    generateReport() {
        const byWeek = WEEKS.map((label, index) => {
            const weekRecords = RECORDS.filter(
                (record) => record.week === index + 1
            );

            return {
                label,
                count: weekRecords.length,
                total: weekRecords.reduce((sum, record) => sum + record.value, 0),
            };
        });

        return {
            total: RECORDS.reduce((sum, record) => sum + record.value, 0),
            count: RECORDS.length,
            byWeek,
            maxWeekTotal: Math.max(...byWeek.map((week) => week.total)),
            completionRate: Math.round(
                (GOAL.completedDays / GOAL.totalDays) * 100
            ),
        };
    }

    renderHeader(title, subtitle) {
        this.card.replaceChildren();

        const header = this.createElement("header", "goal-panel__header");
        const heading = this.createElement("div");
        heading.append(
            this.createElement(
                "span",
                "goal-panel__badge",
                "DEMONSTRAÇÃO • DADOS FICTÍCIOS"
            ),
            this.createElement("h2", "goal-panel__title", title),
            this.createElement("p", "goal-panel__subtitle", subtitle)
        );
        header.append(
            heading,
            this.createButton("Voltar ao menu", () => this.hide())
        );
        this.card.append(header);
    }

    showGoalView() {
        const report = this.generateReport();
        this.renderHeader(
            "Minha meta",
            `Período de acompanhamento: ${GOAL.startDate} a ${GOAL.endDate}`
        );

        const box = this.createElement("div", "goal-panel__box");
        const titleRow = this.createElement("div", "goal-panel__row");
        titleRow.append(
            this.createElement("strong", "", GOAL.title),
            this.createElement("span", "goal-panel__status", "Período concluído")
        );

        const progressRow = this.createElement("div", "goal-panel__row");
        progressRow.append(
            this.createElement(
                "span",
                "",
                `${GOAL.completedDays} de ${GOAL.totalDays} dias cumpridos`
            ),
            this.createElement("span", "", `${report.completionRate}%`)
        );

        const progress = this.createElement("div", "goal-panel__progress");
        progress.setAttribute("role", "progressbar");
        progress.setAttribute("aria-label", "Progresso da meta");
        progress.setAttribute("aria-valuemin", "0");
        progress.setAttribute("aria-valuemax", String(GOAL.totalDays));
        progress.setAttribute("aria-valuenow", String(GOAL.completedDays));
        const fill = this.createElement("div", "goal-panel__progress-fill");
        fill.style.width = `${report.completionRate}%`;
        progress.append(fill);

        const days = this.createElement("div", "goal-panel__days");
        days.setAttribute("aria-hidden", "true");
        for (let day = 1; day <= GOAL.totalDays; day += 1) {
            const cell = this.createElement(
                "div",
                day <= GOAL.completedDays
                    ? "goal-panel__day goal-panel__day--done"
                    : "goal-panel__day"
            );
            cell.title = `Dia ${day}`;
            days.append(cell);
        }
        box.append(titleRow, progressRow, progress, days);

        this.card.append(
            box,
            this.createElement(
                "p",
                "goal-panel__note",
                `Valores registrados no período: ${report.count} registros, ` +
                    `${this.formatCurrency(report.total)} declarados como preservados. ` +
                    `Recompensa da meta: +${GOAL.rewardCoins} moedas virtuais.`
            ),
            this.createElement(
                "p",
                "goal-panel__note",
                "Os valores são fictícios e não representam atividade real. " +
                    "A plataforma não recebe, bloqueia nem movimenta dinheiro."
            )
        );

        const actions = this.createElement("div", "goal-panel__actions");
        const reportButton = this.createButton(
            "Gerar relatório",
            () => this.showReportView(),
            true
        );
        actions.append(
            reportButton,
            this.createButton("Ir para o jogo", () => this.continueToGame())
        );
        this.card.append(actions);
        reportButton.focus({ preventScroll: true });
        this.card.scrollTop = 0;
    }

    showReportView() {
        const report = this.generateReport();
        this.renderHeader(
            "Relatório do período",
            `${GOAL.title} • ${GOAL.startDate} a ${GOAL.endDate}`
        );

        this.card.append(this.renderStats(report));
        this.card.append(
            this.createElement(
                "h3",
                "goal-panel__section-title",
                "Distribuição dos registros ao longo do tempo"
            ),
            this.renderWeekBars(report),
            this.createElement(
                "h3",
                "goal-panel__section-title",
                "Situações associadas aos registros"
            ),
            this.renderRecordsTable(),
            this.createElement(
                "p",
                "goal-panel__note",
                "Este relatório usa somente valores fictícios de demonstração. " +
                    "Não estima ganhos ou perdas em situações hipotéticas."
            ),
            this.createElement(
                "p",
                "goal-panel__note",
                "Caso uma meta não seja cumprida, ela pode ser redefinida sem " +
                    "eliminar conquistas anteriores nem aplicar penalidades."
            )
        );

        const actions = this.createElement("div", "goal-panel__actions");
        const backButton = this.createButton("Voltar à meta", () =>
            this.showGoalView()
        );
        actions.append(
            backButton,
            this.createButton("Ir para o jogo", () => this.continueToGame(), true)
        );
        this.card.append(actions);
        backButton.focus({ preventScroll: true });
        this.card.scrollTop = 0;
    }

    renderStats(report) {
        const stats = [
            ["Dias cumpridos", `${GOAL.completedDays}/${GOAL.totalDays}`],
            ["Total demonstrativo", this.formatCurrency(report.total)],
            ["Registros no período", String(report.count)],
            ["Moedas virtuais demonstrativas", `+${GOAL.rewardCoins}`],
        ];
        const container = this.createElement("div", "goal-panel__stats");

        stats.forEach(([label, value]) => {
            const box = this.createElement("div", "goal-panel__box");
            box.append(
                this.createElement("span", "goal-panel__stat-label", label),
                this.createElement("strong", "goal-panel__stat-value", value)
            );
            container.append(box);
        });

        return container;
    }

    renderWeekBars(report) {
        const container = this.createElement("div");

        report.byWeek.forEach((week, index) => {
            const row = this.createElement("div", "goal-panel__bar-row");
            const track = this.createElement("div", "goal-panel__bar-track");
            const fill = this.createElement("div", "goal-panel__bar-fill");
            fill.style.width =
                report.maxWeekTotal > 0
                    ? `${(week.total / report.maxWeekTotal) * 100}%`
                    : "0%";
            track.append(fill);
            row.append(
                this.createElement(
                    "span",
                    "",
                    `Semana ${index + 1} (${week.label})`
                ),
                track,
                this.createElement(
                    "span",
                    "goal-panel__bar-value",
                    this.formatCurrency(week.total)
                )
            );
            container.append(row);
        });

        return container;
    }

    renderRecordsTable() {
        const wrap = this.createElement("div", "goal-panel__table-wrap");
        const table = this.createElement("table", "goal-panel__table");
        const head = this.createElement("thead");
        const headRow = this.createElement("tr");

        ["Data", "Situação", "Valor demonstrativo"].forEach((label, index) => {
            const heading = this.createElement(
                "th",
                index === 2 ? "is-number" : "",
                label
            );
            heading.scope = "col";
            headRow.append(heading);
        });
        head.append(headRow);

        const body = this.createElement("tbody");
        RECORDS.forEach((record) => {
            const row = this.createElement("tr");
            row.append(
                this.createElement("td", "", record.date),
                this.createElement("td", "", record.trigger),
                this.createElement(
                    "td",
                    "is-number",
                    this.formatCurrency(record.value)
                )
            );
            body.append(row);
        });

        table.append(head, body);
        wrap.append(table);
        return wrap;
    }
}

export default GoalPanel;

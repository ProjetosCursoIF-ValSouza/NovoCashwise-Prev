-- CreateTable
CREATE TABLE `atualizacao_monetaria` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `mes_ano` VARCHAR(7) NOT NULL,
    `indice` DECIMAL(10, 6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salario_atualizado` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `mes_ano` VARCHAR(7) NOT NULL,
    `salario_atualizado` DECIMAL(10, 2) NOT NULL,
    `simulacao_beneficio_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulacao_beneficio` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `genero` ENUM('m', 'f') NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `idade` INTEGER NULL,
    `tempo_contribuicao_mes` INTEGER NULL,
    `idade_aposentadoria` INTEGER NULL,
    `mes_aposentadoria` INTEGER NULL,
    `anoAposentadoria` INTEGER NULL,
    `tempo_contribuicao_pendente` INTEGER NULL,
    `valor_beneficio` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulacao_periodo_trabalho` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `mes` INTEGER NOT NULL,
    `ano` INTEGER NOT NULL,
    `salario` DECIMAL(10, 2) NOT NULL,
    `mes_ano` VARCHAR(7) NOT NULL,
    `simulacao_beneficio_id` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_simulacao_periodo_trabalho_simulacao_beneficio_idx`(`simulacao_beneficio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `salario_atualizado` ADD CONSTRAINT `salario_atualizado_simulacao_beneficio_id_fkey` FOREIGN KEY (`simulacao_beneficio_id`) REFERENCES `simulacao_beneficio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `simulacao_periodo_trabalho` ADD CONSTRAINT `fk_simulacao_periodo_trabalho_simulacao_beneficio` FOREIGN KEY (`simulacao_beneficio_id`) REFERENCES `simulacao_beneficio`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

rule bwa_map:
    input:
        "data/genome.fa",
        "data/samples/A.fastq"
    output:
        "A.bam"
    shell:
        "bwa mem {input} | samtools view -Sb - > {output}"
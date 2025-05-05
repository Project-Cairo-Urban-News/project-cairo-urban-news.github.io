<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:math="http://www.w3.org/2005/xpath-functions/math"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  exclude-result-prefixes="xs math"
  xpath-default-namespace="http://www.tei-c.org/ns/1.0"
  expand-text="yes"
  version="3.0">
  
  <xsl:output method="json" indent="yes"/>
  
  <xsl:function name="tei:apply-templates" as="item()*">
    <xsl:param name="articles"></xsl:param>
    <xsl:apply-templates select="$articles//body/div"/>
  </xsl:function>
  
  <xsl:template name="xsl:initial-template">
    <xsl:variable name="articlesAr" select="collection('../src/CairoUrbanNews/articles/arabic?select=*.xml')[TEI/teiHeader/revisionDesc[@status='cleared']]"/>
    <xsl:variable name="articlesOta" select="collection('../src/CairoUrbanNews/articles/ottoman?select=*.xml')[TEI/teiHeader/revisionDesc[@status='cleared']]"/>
    <xsl:variable name="articles" select="$articlesAr | $articlesOta"/>
    <xsl:sequence select="array { tei:apply-templates($articles) }"/>
  </xsl:template>
  
  <xsl:template match="body/div">
    <xsl:map>
      <xsl:map-entry key="'id'" select="xs:string(@xml:id)"/>
      <xsl:map-entry key="'title'" select="normalize-space(string-join(head[1]//text()))"/>
      <xsl:map-entry key="'body'" select="tei:get-text(.)"/>
      <xsl:map-entry key="'lang'" select="string(ancestor::text/@xml:lang)"/>
    </xsl:map>
  </xsl:template>
  
  <xsl:template match="body/div/head[1]" mode="text"/>
  <xsl:template match="sic"/>
  
  <xsl:function name="tei:get-text" as="xs:string">
    <xsl:param name="div"/>
    <xsl:variable name="result">
      <xsl:apply-templates select="$div" mode="text"/>
    </xsl:variable>
    <xsl:sequence select="normalize-space(string-join($result))"/>
  </xsl:function>
</xsl:stylesheet>